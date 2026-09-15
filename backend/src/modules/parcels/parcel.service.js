/**
 * Land Stack — Parcel Service (Database-Only)
 * 
 * Database access for parcel operations backed directly by Supabase PostgreSQL / PostGIS.
 * Fetches real parcels and aggregates the comprehensive Parcel 360° title dossier.
 */

import { getSupabaseAdmin, getSupabaseAnon } from '../../config/supabase.js';
import { Errors } from '../../core/errors.js';
import { UserTypes } from '../../core/permissions.js';

export const parcelService = {
  // ─── Search Parcels ────────────────────────────────────────────────────────
  async searchParcels({ search, village, tehsil, district, state, status, cursor, limit = 50 }, client) {
    const db = client || getSupabaseAnon();
    if (!db) throw Errors.sourceUnavailable('Database');

    let query = db
      .from('parcels')
      .select('ulpin, survey_number, gat_number, khasra_number, village_name, village_code, tehsil_code, district_code, state_code, area, area_unit, land_use, classification, status, latitude, longitude', { count: 'exact' });

    if (state) query = query.eq('state_code', state);
    if (district) query = query.eq('district_code', district);
    if (tehsil) query = query.eq('tehsil_code', tehsil);
    if (village) query = query.eq('village_code', village);
    if (status) query = query.eq('status', status);

    if (search) {
      const cleanSearch = _sanitizeSearch(search);
      query = query.or(`ulpin.ilike.%${cleanSearch}%,survey_number.ilike.%${cleanSearch}%,gat_number.ilike.%${cleanSearch}%,village_name.ilike.%${cleanSearch}%`);
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
      page: { nextCursor, hasMore, total: count ?? results.length },
    };
  },

  // ─── Get Parcel by ULPIN ──────────────────────────────────────────────────
  async getParcelByUlpin(ulpin, client) {
    const db = client || getSupabaseAnon();
    if (!db) throw Errors.sourceUnavailable('Database');

    const cleanUlpin = ulpin.trim();

    const { data, error } = await db
      .from('parcels')
      .select('*')
      .ilike('ulpin', cleanUlpin)
      .maybeSingle();

    if (error || !data) throw Errors.notFound('Parcel', ulpin);
    return data;
  },

  // ─── Parcel 360° Aggregator ───────────────────────────────────────────────
  async getParcel360(ulpin, user, client) {
    const parcel = await parcelService.getParcelByUlpin(ulpin, client);

    // Parallel fetch all sections from real PostgreSQL tables
    const [owners, encumbrances, restrictions, zoning, tax, courtCases, documents, mutations, valuation] =
      await Promise.all([
        _getOwners(ulpin, client),
        _getEncumbrances(ulpin, client),
        _getRestrictions(ulpin, client),
        _getZoning(ulpin, client),
        _getTax(ulpin, client),
        _getCourtCases(ulpin, client),
        _getDocuments(ulpin, client),
        _getMutations(ulpin, client),
        _getValuation(ulpin, client),
      ]);

    // Build the 360° dossier
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
        currentOwner: parcel.current_owner || owners[0]?.owner_name || 'Recorded Landholder',
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
          ? { lat: Number(parcel.latitude), lng: Number(parcel.longitude) }
          : null,
        geometry: parcel.boundary_coordinates || parcel.geometry || null,
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
        hasPending: mutations.some(m => !['CLOSED', 'REJECTED', 'CERTIFIED', 'SANCTIONED', 'APPROVED'].includes(m.status)),
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

  // Individual section getters
  async getOwners(ulpin, client) { return _getOwners(ulpin, client); },
  async getEncumbrances(ulpin, client) { return _getEncumbrances(ulpin, client); },
  async getRestrictions(ulpin, client) { return _getRestrictions(ulpin, client); },
  async getZoning(ulpin, client) { return _getZoning(ulpin, client); },
  async getTax(ulpin, client) { return _getTax(ulpin, client); },
  async getCourtCases(ulpin, client) { return _getCourtCases(ulpin, client); },
  async getDocuments(ulpin, client) { return _getDocuments(ulpin, client); },
  async getValuation(ulpin, client) { return _getValuation(ulpin, client); },
};

// ─── Data Fetchers (Real PostgreSQL queries) ──────────────────────────────────

async function _getOwners(ulpin, client) {
  const db = client || getSupabaseAnon();
  if (!db) return [];
  const { data } = await db.from('ownership_records').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getEncumbrances(ulpin, client) {
  const db = client || getSupabaseAnon();
  if (!db) return [];
  const { data } = await db.from('encumbrances').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getRestrictions(ulpin, client) {
  const db = client || getSupabaseAnon();
  if (!db) return [];
  const { data } = await db.from('restrictions').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getZoning(ulpin, client) {
  const db = client || getSupabaseAnon();
  if (!db) return null;
  const { data } = await db.from('zoning').select('*').ilike('parcel_ulpin', ulpin).maybeSingle();
  return data || null;
}

async function _getTax(ulpin, client) {
  const db = client || getSupabaseAnon();
  if (!db) return null;
  const { data } = await db.from('tax_records').select('*').ilike('parcel_ulpin', ulpin).maybeSingle();
  return data || null;
}

async function _getCourtCases(ulpin, client) {
  const db = client || getSupabaseAnon();
  if (!db) return [];
  const { data } = await db.from('court_cases').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getDocuments(ulpin, client) {
  const db = client || getSupabaseAnon();
  if (!db) return [];
  const { data } = await db.from('parcel_documents').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getMutations(ulpin, client) {
  const db = client || getSupabaseAnon();
  if (!db) return [];
  const { data } = await db.from('mutations').select('*').ilike('parcel_ulpin', ulpin);
  return data || [];
}

async function _getValuation(ulpin, client) {
  const db = client || getSupabaseAnon();
  if (!db) return null;
  const { data } = await db.from('valuations').select('*').ilike('parcel_ulpin', ulpin).maybeSingle();
  return data || null;
}

function _computeDataHealth(parcel, owners, encumbrances, restrictions) {
  let score = 0;
  const checks = {};

  // Check 1: Parcel core attributes
  if (parcel.ulpin && parcel.area && parcel.village_name) {
    score += 25;
    checks.coreAttributes = 'COMPLETE';
  } else {
    checks.coreAttributes = 'INCOMPLETE';
  }

  // Check 2: Coordinates
  if (parcel.latitude && parcel.longitude) {
    score += 25;
    checks.gisCoordinates = 'VERIFIED';
  } else {
    checks.gisCoordinates = 'MISSING';
  }

  // Check 3: Ownership
  if (owners && owners.length > 0) {
    score += 25;
    checks.ownershipRecords = 'RECORDED';
  } else {
    checks.ownershipRecords = 'NO_RECORDS';
  }

  // Check 4: Title status
  const isEncumbered = encumbrances && encumbrances.some(e => e.status === 'ACTIVE');
  const isRestricted = restrictions && restrictions.some(r => r.status === 'ACTIVE');
  if (!isEncumbered && !isRestricted) {
    score += 25;
    checks.titleClarity = 'CLEAR';
  } else {
    checks.titleClarity = isEncumbered ? 'ENCUMBERED' : 'RESTRICTED';
  }

  return {
    completeness: score,
    checks,
    summary: score >= 75 ? 'HIGH_CONFIDENCE' : score >= 50 ? 'MEDIUM_CONFIDENCE' : 'NEEDS_REVIEW',
  };
}

function _filterForCitizen(dossier) {
  const filtered = { ...dossier };
  if (filtered.dataHealth) {
    filtered.dataHealth = {
      completeness: filtered.dataHealth.completeness,
      summary: filtered.dataHealth.completeness >= 80 ? 'Good' :
               filtered.dataHealth.completeness >= 50 ? 'Partial' : 'Incomplete',
    };
  }
  return filtered;
}

function _sanitizeSearch(input) {
  return String(input).replace(/[%_'"\\]/g, '').trim();
}

export const ParcelService = parcelService;
export default parcelService;
