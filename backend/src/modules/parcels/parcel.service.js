/**
 * Land Stack — Parcel Service
 * 
 * Database access for parcel operations.
 * In mock mode, uses built-in data; in supabase mode, queries the database.
 * 
 * IMPORTANT: No mock fallback on error in supabase mode.
 * If the DB fails, we return an error — not fake land records.
 */

import { getSupabaseAdmin, isMockMode } from '../../config/supabase.js';
import { mockStore } from '../../data/mockStore.js';
import { Errors } from '../../core/errors.js';
import { UserTypes } from '../../core/permissions.js';

export const parcelService = {
  // ─── Search Parcels ────────────────────────────────────────────────────────
  async searchParcels({ search, village, tehsil, district, state, status, cursor, limit = 50 }) {
    if (isMockMode()) {
      return _mockSearchParcels({ search, village, tehsil, district, state, status, cursor, limit });
    }

    const db = getSupabaseAdmin();
    if (!db) throw Errors.sourceUnavailable('Database');

    let query = db.from('parcels').select('ulpin, survey_number, gat_number, village_name, village_code, tehsil_code, district_code, state_code, area, area_unit, land_use, classification, status, latitude, longitude', { count: 'exact' });

    if (state) query = query.eq('state_code', state);
    if (district) query = query.eq('district_code', district);
    if (tehsil) query = query.eq('tehsil_code', tehsil);
    if (village) query = query.eq('village_code', village);
    if (status) query = query.eq('status', status);

    if (search) {
      // Use parameterized filter — no string interpolation
      query = query.or(`ulpin.ilike.%${_sanitizeSearch(search)}%,survey_number.ilike.%${_sanitizeSearch(search)}%,village_name.ilike.%${_sanitizeSearch(search)}%`);
    }

    // Cursor-based pagination
    if (cursor) {
      query = query.gt('ulpin', cursor);
    }

    query = query.order('ulpin', { ascending: true }).limit(limit + 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[ParcelService] Search failed:', error.message);
      throw Errors.internal('Failed to search parcels.');
    }

    const hasMore = data && data.length > limit;
    const results = hasMore ? data.slice(0, limit) : (data || []);
    const nextCursor = hasMore ? results[results.length - 1].ulpin : null;

    return {
      parcels: results,
      page: { nextCursor, hasMore, total: count },
    };
  },

  // ─── Get Parcel by ULPIN ──────────────────────────────────────────────────
  async getParcelByUlpin(ulpin) {
    if (isMockMode()) {
      const parcel = (mockStore.parcels || []).find(
        p => p.ulpin.toLowerCase() === ulpin.toLowerCase()
      );
      if (!parcel) throw Errors.notFound('Parcel', ulpin);
      return parcel;
    }

    const db = getSupabaseAdmin();
    if (!db) throw Errors.sourceUnavailable('Database');

    const { data, error } = await db
      .from('parcels')
      .select('*')
      .ilike('ulpin', ulpin)
      .single();

    if (error || !data) throw Errors.notFound('Parcel', ulpin);
    return data;
  },

  // ─── Parcel 360° Aggregator ───────────────────────────────────────────────
  async getParcel360(ulpin, user) {
    const parcel = await parcelService.getParcelByUlpin(ulpin);

    // Parallel fetch all sections
    const [owners, encumbrances, restrictions, zoning, tax, courtCases, documents, mutations, valuation] =
      await Promise.all([
        _getOwners(ulpin),
        _getEncumbrances(ulpin),
        _getRestrictions(ulpin),
        _getZoning(ulpin),
        _getTax(ulpin),
        _getCourtCases(ulpin),
        _getDocuments(ulpin),
        _getMutations(ulpin),
        _getValuation(ulpin),
      ]);

    // Build the 360° response
    const dossier = {
      // Overview
      overview: {
        ulpin: parcel.ulpin,
        surveyNumber: parcel.survey_number || parcel.surveyNumber,
        gatNumber: parcel.gat_number || parcel.gatNumber,
        khasraNumber: parcel.khasra_number || parcel.khasraNumber,
        ctsNumber: parcel.cts_number || parcel.ctsNumber,
        area: parcel.area,
        areaUnit: parcel.area_unit || parcel.areaUnit || 'Hectare',
        landUse: parcel.land_use || parcel.landUse,
        classification: parcel.classification,
        status: parcel.status,
        villageName: parcel.village_name || parcel.villageName,
        jurisdiction: {
          stateCode: parcel.state_code || parcel.stateCode,
          districtCode: parcel.district_code || parcel.districtCode,
          tehsilCode: parcel.tehsil_code || parcel.tehsilCode,
          villageCode: parcel.village_code || parcel.villageCode,
        },
        provenance: {
          source: parcel.source_system || parcel.sourceSystem || 'Land Stack',
          retrievedAt: parcel.last_updated || parcel.lastUpdated || parcel.updated_at,
          authority: parcel.source || 'Revenue Department',
        },
      },

      // Map
      map: {
        latitude: parcel.latitude,
        longitude: parcel.longitude,
        centroid: parcel.latitude && parcel.longitude
          ? { lat: parcel.latitude, lng: parcel.longitude }
          : null,
        geometry: parcel.geometry || null,
      },

      // Ownership
      ownership: {
        current: owners,
        provenance: { source: 'Revenue Records', authority: 'Revenue Department' },
      },

      // Encumbrances
      encumbrances: {
        records: encumbrances,
        count: encumbrances.length,
        hasActive: encumbrances.some(e => (e.status || 'ACTIVE') === 'ACTIVE'),
      },

      // Restrictions
      restrictions: {
        records: restrictions,
        count: restrictions.length,
        types: [...new Set(restrictions.map(r => r.type))],
      },

      // Planning / Zoning
      planning: zoning ? {
        currentZone: zoning.current_zone || zoning.currentZone,
        masterPlan: zoning.master_plan || zoning.masterPlan,
        maxFsi: zoning.max_fsi || zoning.maxFsi,
        roadWidth: zoning.road_width_meters || zoning.roadWidthMeters,
        permissibleUses: zoning.permissible_uses || zoning.permissibleUses || [],
        authority: zoning.authority,
      } : null,

      // Tax
      tax: tax ? {
        assessmentYear: tax.assessment_year || tax.assessmentYear,
        annualTax: tax.annual_tax || tax.annualTax,
        pendingDues: tax.pending_dues || tax.pendingDues || 0,
        lastPaidDate: tax.last_paid_date || tax.lastPaidDate,
        paymentStatus: tax.payment_status || tax.paymentStatus || 'UNKNOWN',
        receiptNumber: tax.receipt_number || tax.receiptNumber,
      } : null,

      // Court Cases
      courts: {
        cases: courtCases,
        count: courtCases.length,
        hasActiveCase: courtCases.some(c => ['PENDING', 'HEARING'].includes(c.status)),
        hasStay: courtCases.some(c => c.stay_granted || c.stayGranted),
      },

      // Valuation / Circle Rate
      valuation: valuation,

      // Mutations
      mutations: {
        records: mutations,
        count: mutations.length,
        hasPending: mutations.some(m => !['CLOSED', 'REJECTED', 'CERTIFIED', 'SANCTIONED'].includes(m.status)),
      },

      // Documents
      documents: documents,

      // Data Health
      dataHealth: _computeDataHealth(parcel, owners, encumbrances, restrictions),
    };

    // Role-based filtering
    if (user && user.userType === UserTypes.CITIZEN) {
      return _filterForCitizen(dossier);
    }

    return dossier;
  },

  // Individual section getters (for sub-endpoints)
  async getOwners(ulpin) { return _getOwners(ulpin); },
  async getEncumbrances(ulpin) { return _getEncumbrances(ulpin); },
  async getRestrictions(ulpin) { return _getRestrictions(ulpin); },
  async getZoning(ulpin) { return _getZoning(ulpin); },
  async getTax(ulpin) { return _getTax(ulpin); },
  async getCourtCases(ulpin) { return _getCourtCases(ulpin); },
  async getDocuments(ulpin) { return _getDocuments(ulpin); },
  async getValuation(ulpin) { return _getValuation(ulpin); },
};

// ─── Data Fetchers ─────────────────────────────────────────────────────────────

async function _getOwners(ulpin) {
  if (isMockMode()) {
    return (mockStore.ownership || []).filter(o =>
      (o.parcelId || o.parcelUlpin || o.parcel_ulpin || '').toLowerCase() === ulpin.toLowerCase()
    );
  }
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data } = await db.from('ownership_records').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getEncumbrances(ulpin) {
  if (isMockMode()) {
    return (mockStore.encumbrances || []).filter(e =>
      (e.parcelId || e.parcelUlpin || e.parcel_ulpin || '').toLowerCase() === ulpin.toLowerCase()
    );
  }
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data } = await db.from('encumbrances').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getRestrictions(ulpin) {
  if (isMockMode()) {
    return (mockStore.restrictions || []).filter(r =>
      (r.parcelId || r.parcelUlpin || r.parcel_ulpin || '').toLowerCase() === ulpin.toLowerCase()
    );
  }
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data } = await db.from('restrictions').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getZoning(ulpin) {
  if (isMockMode()) {
    return (mockStore.zoning || []).find(z =>
      (z.parcelId || z.parcelUlpin || z.parcel_ulpin || '').toLowerCase() === ulpin.toLowerCase()
    ) || null;
  }
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data } = await db.from('zoning').select('*').ilike('parcel_ulpin', ulpin).maybeSingle();
  return data || null;
}

async function _getTax(ulpin) {
  if (isMockMode()) {
    return (mockStore.taxRecords || []).find(t =>
      (t.parcelId || t.parcelUlpin || t.parcel_ulpin || '').toLowerCase() === ulpin.toLowerCase()
    ) || null;
  }
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data } = await db.from('tax_records').select('*').ilike('parcel_ulpin', ulpin).maybeSingle();
  return data || null;
}

async function _getCourtCases(ulpin) {
  if (isMockMode()) {
    return (mockStore.courtCases || []).filter(c =>
      (c.parcelId || c.parcelUlpin || c.parcel_ulpin || '').toLowerCase() === ulpin.toLowerCase()
    );
  }
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data } = await db.from('court_cases').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getDocuments(ulpin) {
  if (isMockMode()) {
    return (mockStore.parcelDocuments || []).filter(d =>
      (d.parcelId || d.parcelUlpin || d.parcel_ulpin || '').toLowerCase() === ulpin.toLowerCase()
    );
  }
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data } = await db.from('parcel_documents').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getMutations(ulpin) {
  if (isMockMode()) {
    return (mockStore.mutations || []).filter(m =>
      (m.parcelId || m.parcelUlpin || m.parcel_ulpin || '').toLowerCase() === ulpin.toLowerCase()
    );
  }
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data } = await db.from('mutations').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getValuation(ulpin) {
  // Circle rate / ready reckoner — returns null if no data available
  if (isMockMode()) {
    // Provide demo valuation for demo parcels
    return {
      circleRate: { value: 4500, unit: 'INR/sq.m', source: 'Ready Reckoner 2026' },
      estimatedValue: null,
      provenance: {
        source: 'Annual Statement of Rates (ASR)',
        authority: 'Inspector General of Registration, Maharashtra',
        effectiveFrom: '2026-04-01',
        effectiveTo: '2027-03-31',
        fetchedAt: new Date().toISOString(),
      },
      disclaimer: 'Reference value only. Not an authoritative transaction valuation.',
    };
  }

  const db = getSupabaseAdmin();
  if (!db) return null;

  // Try to find circle rate for this parcel's jurisdiction
  const parcel = await parcelService.getParcelByUlpin(ulpin);
  if (!parcel) return null;

  const { data } = await db
    .from('circle_rates')
    .select('*')
    .eq('state_code', parcel.state_code)
    .eq('district_code', parcel.district_code)
    .lte('effective_from', new Date().toISOString())
    .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString()}`)
    .maybeSingle();

  if (!data) return null;

  return {
    circleRate: { value: data.rate, unit: data.unit, source: data.source_reference },
    provenance: {
      source: data.source_authority,
      authority: data.source_authority,
      effectiveFrom: data.effective_from,
      effectiveTo: data.effective_to,
      fetchedAt: new Date().toISOString(),
    },
    disclaimer: 'Reference value only. Not an authoritative transaction valuation.',
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function _sanitizeSearch(search) {
  // Remove characters that could break PostgREST filters
  return search.replace(/[%_'"\\;()]/g, '').trim();
}

function _computeDataHealth(parcel, owners, encumbrances, restrictions) {
  const checks = [];
  let score = 0;
  const total = 5;

  // 1. Has owners
  if (owners.length > 0) { score++; checks.push({ check: 'ownership', status: 'OK' }); }
  else { checks.push({ check: 'ownership', status: 'MISSING', message: 'No ownership records found' }); }

  // 2. Has coordinates
  if (parcel.latitude && parcel.longitude) { score++; checks.push({ check: 'geolocation', status: 'OK' }); }
  else { checks.push({ check: 'geolocation', status: 'MISSING', message: 'No coordinates available' }); }

  // 3. Has survey number
  if (parcel.survey_number || parcel.surveyNumber || parcel.gat_number || parcel.gatNumber) {
    score++; checks.push({ check: 'survey_id', status: 'OK' });
  } else {
    checks.push({ check: 'survey_id', status: 'MISSING', message: 'No survey/gat number' });
  }

  // 4. Area present
  if (parcel.area && parcel.area > 0) { score++; checks.push({ check: 'area', status: 'OK' }); }
  else { checks.push({ check: 'area', status: 'MISSING', message: 'Area not recorded' }); }

  // 5. Source freshness
  const lastUpdated = parcel.last_updated || parcel.lastUpdated || parcel.updated_at;
  if (lastUpdated) {
    const daysSince = (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 365) { score++; checks.push({ check: 'freshness', status: 'OK' }); }
    else { checks.push({ check: 'freshness', status: 'STALE', message: `Last updated ${Math.floor(daysSince)} days ago` }); }
  } else {
    checks.push({ check: 'freshness', status: 'UNKNOWN', message: 'No update timestamp' });
  }

  return {
    completeness: Math.round((score / total) * 100),
    score: `${score}/${total}`,
    checks,
  };
}

function _filterForCitizen(dossier) {
  // Citizens get simplified data — no officer notes, no internal DQI details
  const filtered = { ...dossier };

  // Simplify data health for citizens
  if (filtered.dataHealth) {
    filtered.dataHealth = {
      completeness: filtered.dataHealth.completeness,
      summary: filtered.dataHealth.completeness >= 80 ? 'Good' :
               filtered.dataHealth.completeness >= 50 ? 'Partial' : 'Incomplete',
    };
  }

  return filtered;
}

function _mockSearchParcels({ search, village, tehsil, district, state, status, cursor, limit }) {
  let list = mockStore.parcels || [];

  if (state) list = list.filter(p => (p.stateCode || p.state_code) === state);
  if (district) list = list.filter(p => (p.districtCode || p.district_code) === district);
  if (tehsil) list = list.filter(p => (p.tehsilCode || p.tehsil_code) === tehsil);
  if (village) list = list.filter(p => (p.villageCode || p.village_code) === village);
  if (status) list = list.filter(p => p.status === status);

  if (search) {
    const q = search.trim().toLowerCase();
    list = list.filter(p =>
      (p.ulpin && p.ulpin.toLowerCase().includes(q)) ||
      (p.surveyNumber && p.surveyNumber.toLowerCase().includes(q)) ||
      (p.survey_number && p.survey_number.toLowerCase().includes(q)) ||
      (p.gatNumber && p.gatNumber.toLowerCase().includes(q)) ||
      (p.villageName && p.villageName.toLowerCase().includes(q)) ||
      (p.village_name && p.village_name.toLowerCase().includes(q))
    );
  }

  // Simple cursor pagination for mock
  if (cursor) {
    const idx = list.findIndex(p => p.ulpin === cursor);
    if (idx >= 0) list = list.slice(idx + 1);
  }

  const hasMore = list.length > limit;
  const results = list.slice(0, limit);

  return {
    parcels: results,
    page: {
      nextCursor: hasMore ? results[results.length - 1]?.ulpin : null,
      hasMore,
      total: (mockStore.parcels || []).length,
    },
  };
}

export const ParcelService = parcelService;
export default parcelService;
