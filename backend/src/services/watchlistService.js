import { getSupabaseAdmin } from '../config/supabase.js';

export const watchlistService = {
  getWatchlist: async (citizenId) => {
    const admin = getSupabaseAdmin();
    if (!admin) return [];

    let query = admin.from('watchlist').select('*, parcels(*)');
    if (citizenId) query = query.eq('citizen_id', citizenId);

    const { data, error } = await query;
    if (error) {
      console.error('[WatchlistService] Query error:', error.message);
      return [];
    }

    return (data || []).map((w) => ({
      ...w,
      citizenId: w.citizen_id,
      parcelId: w.parcel_ulpin,
      notifyMutations: w.notify_mutations,
      notifyEncumbrances: w.notify_encumbrances,
      notifyCourtCases: w.notify_court_cases,
      createdAt: w.created_at,
    }));
  },

  addToWatchlist: async ({ citizenId, parcelId, label }) => {
    const admin = getSupabaseAdmin();
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

    if (admin) {
      const { error } = await admin.from('watchlist').insert(entry);
      if (error) {
        console.error('[WatchlistService] Insert error:', error.message);
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

  removeFromWatchlist: async (id) => {
    const admin = getSupabaseAdmin();
    if (admin) {
      const { error } = await admin.from('watchlist').delete().or(`id.eq.${id},parcel_ulpin.eq.${id}`);
      if (error) {
        console.error('[WatchlistService] Delete error:', error.message);
      }
    }
    return { success: true, id };
  },
};
