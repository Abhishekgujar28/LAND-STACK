import { getSupabaseAdmin, getSupabaseAnon } from '../../config/supabase.js';

export const watchlistService = {
  getWatchlist: async (citizenId, client) => {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) return [];

    let query = db.from('watchlist').select('*');
    if (citizenId) query = query.eq('citizen_id', citizenId);

    const { data: watchItems, error } = await query;
    if (error) {
      console.error('[WatchlistService] Query error:', error.message);
      return [];
    }

    if (!watchItems || watchItems.length === 0) return [];

    const ulpins = [...new Set(watchItems.map((w) => w.parcel_ulpin).filter(Boolean))];
    let parcelMap = {};
    if (ulpins.length > 0) {
      const { data: parcelsData } = await db.from('parcels').select('*').in('ulpin', ulpins);
      if (parcelsData) {
        parcelsData.forEach((p) => {
          parcelMap[p.ulpin] = p;
        });
      }
    }

    return watchItems.map((w) => ({
      ...w,
      citizenId: w.citizen_id,
      parcelId: w.parcel_ulpin,
      notifyMutations: w.notify_mutations,
      notifyEncumbrances: w.notify_encumbrances,
      notifyCourtCases: w.notify_court_cases,
      createdAt: w.created_at,
      parcels: parcelMap[w.parcel_ulpin] || null,
    }));
  },

  addToWatchlist: async ({ citizenId, parcelId, label }, client) => {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    const newId = `WL-${Date.now()}`;
    const now = new Date().toISOString();

    const entry = {
      id: newId,
      citizen_id: citizenId,
      parcel_ulpin: parcelId,
      label: label || 'Monitored Parcel',
      notify_mutations: true,
      notify_encumbrances: true,
      notify_court_cases: true,
      created_at: now,
    };

    if (db) {
      const { error } = await db.from('watchlist').upsert(entry, { onConflict: 'citizen_id, parcel_ulpin' });
      if (error) {
        console.error('[WatchlistService] Upsert error:', error.message);
      }
    }

    return {
      ...entry,
      citizenId: entry.citizen_id,
      parcelId: entry.parcel_ulpin,
      notifyMutations: entry.notify_mutations,
      notifyEncumbrances: entry.notify_encumbrances,
      notifyCourtCases: entry.notify_court_cases,
      createdAt: entry.created_at,
    };
  },

  removeFromWatchlist: async (id, client) => {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (db) {
      const { error } = await db.from('watchlist').delete().or(`id.eq.${id},parcel_ulpin.eq.${id}`);
      if (error) {
        console.error('[WatchlistService] Delete error:', error.message);
      }
    }
    return { success: true, id };
  },
};
