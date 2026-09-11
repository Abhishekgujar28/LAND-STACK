import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../data/mockStore.js';

export const parcelService = {
  getParcels: async ({ search, village, tehsil, district, state, status, limit = 50, offset = 0 } = {}) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('parcels').select('*', { count: 'exact' });
        if (state) query = query.eq('state_code', state);
        if (district) query = query.eq('district_code', district);
        if (tehsil) query = query.eq('tehsil_code', tehsil);
        if (village) query = query.eq('village_code', village);
        if (status) query = query.eq('status', status);
        if (search) {
          query = query.or(`ulpin.ilike.%${search}%,survey_number.ilike.%${search}%,gat_number.ilike.%${search}%,village_name.ilike.%${search}%`);
        }
        query = query.range(offset, offset + limit - 1);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[ParcelService] Supabase query failed, falling back to mock store:', err.message);
      }
    }

    // Mock Store Fallback
    let list = mockStore.parcels || [];
    if (state) list = list.filter(p => p.stateCode === state);
    if (district) list = list.filter(p => p.districtCode === district);
    if (tehsil) list = list.filter(p => p.tehsilCode === tehsil);
    if (village) list = list.filter(p => p.villageCode === village);
    if (status) list = list.filter(p => p.status === status);
    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        (p.ulpin && p.ulpin.toLowerCase().includes(q)) ||
        (p.surveyNumber && p.surveyNumber.toLowerCase().includes(q)) ||
        (p.gatNumber && p.gatNumber.toLowerCase().includes(q)) ||
        (p.khasraNumber && p.khasraNumber.toLowerCase().includes(q)) ||
        (p.ctsNumber && p.ctsNumber.toLowerCase().includes(q)) ||
        (p.villageName && p.villageName.toLowerCase().includes(q))
      );
    }
    return list.slice(offset, offset + limit);
  },

  getParcelByUlpin: async (ulpin) => {
    if (!ulpin) return null;
    const cleanUlpin = ulpin.trim();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('parcels')
          .select('*')
          .ilike('ulpin', cleanUlpin)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[ParcelService] Supabase getParcelByUlpin failed:', err.message);
      }
    }

    return (mockStore.parcels || []).find(
      p => p.ulpin.toLowerCase() === cleanUlpin.toLowerCase()
    ) || null;
  },

  getParcelOwners: async (ulpin) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('ownership_records')
          .select('*')
          .ilike('parcel_ulpin', ulpin);
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[ParcelService] Supabase getOwners failed:', err.message);
      }
    }
    return (mockStore.ownership || []).filter(
      o => (o.parcelId || o.parcelUlpin || '').toLowerCase() === ulpin.toLowerCase()
    );
  },

  getParcelEncumbrances: async (ulpin) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('encumbrances')
          .select('*')
          .ilike('parcel_ulpin', ulpin);
        if (!error && data) return data;
      } catch (err) {
        console.warn('[ParcelService] Supabase getEncumbrances failed:', err.message);
      }
    }
    return (mockStore.encumbrances || []).filter(
      e => (e.parcelId || e.parcelUlpin || '').toLowerCase() === ulpin.toLowerCase()
    );
  },

  getParcelRestrictions: async (ulpin) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('restrictions')
          .select('*')
          .ilike('parcel_ulpin', ulpin);
        if (!error && data) return data;
      } catch (err) {
        console.warn('[ParcelService] Supabase getRestrictions failed:', err.message);
      }
    }
    return (mockStore.restrictions || []).filter(
      r => (r.parcelId || r.parcelUlpin || '').toLowerCase() === ulpin.toLowerCase()
    );
  },

  getParcelZoning: async (ulpin) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('zoning')
          .select('*')
          .ilike('parcel_ulpin', ulpin)
          .maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[ParcelService] Supabase getZoning failed:', err.message);
      }
    }
    return (mockStore.zoning || []).find(
      z => (z.parcelId || z.parcelUlpin || '').toLowerCase() === ulpin.toLowerCase()
    ) || null;
  },

  getParcelTaxRecord: async (ulpin) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('tax_records')
          .select('*')
          .ilike('parcel_ulpin', ulpin)
          .maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[ParcelService] Supabase getTaxRecord failed:', err.message);
      }
    }
    return (mockStore.taxRecords || []).find(
      t => (t.parcelId || t.parcelUlpin || '').toLowerCase() === ulpin.toLowerCase()
    ) || null;
  },

  getParcelCourtCases: async (ulpin) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('court_cases')
          .select('*')
          .ilike('parcel_ulpin', ulpin);
        if (!error && data) return data;
      } catch (err) {
        console.warn('[ParcelService] Supabase getCourtCases failed:', err.message);
      }
    }
    return (mockStore.courtCases || []).filter(
      c => (c.parcelId || c.parcelUlpin || '').toLowerCase() === ulpin.toLowerCase()
    );
  },

  getParcelDocuments: async (ulpin) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('parcel_documents')
          .select('*')
          .ilike('parcel_ulpin', ulpin);
        if (!error && data) return data;
      } catch (err) {
        console.warn('[ParcelService] Supabase getParcelDocuments failed:', err.message);
      }
    }
    return (mockStore.parcelDocuments || []).filter(
      d => (d.parcelId || d.parcelUlpin || '').toLowerCase() === ulpin.toLowerCase()
    );
  },

  /**
   * Assembles a 360-degree composite profile for a parcel
   */
  getParcel360: async (ulpin) => {
    const parcel = await parcelService.getParcelByUlpin(ulpin);
    if (!parcel) return null;

    const [owners, encumbrances, restrictions, zoning, tax, cases, documents, mutations] =
      await Promise.all([
        parcelService.getParcelOwners(ulpin),
        parcelService.getParcelEncumbrances(ulpin),
        parcelService.getParcelRestrictions(ulpin),
        parcelService.getParcelZoning(ulpin),
        parcelService.getParcelTaxRecord(ulpin),
        parcelService.getParcelCourtCases(ulpin),
        parcelService.getParcelDocuments(ulpin),
        (mockStore.mutations || []).filter(
          m => (m.parcelId || m.parcelUlpin || '').toLowerCase() === ulpin.toLowerCase()
        ),
      ]);

    return {
      ...parcel,
      owners,
      encumbrances,
      restrictions,
      zoning,
      tax,
      courtCases: cases,
      documents,
      mutations,
    };
  },
};
