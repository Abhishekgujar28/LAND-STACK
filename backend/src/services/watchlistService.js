import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../data/mockStore.js';

export const watchlistService = {
  getWatchlist: async (citizenId) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('watchlist').select('*, parcels(*)');
        if (citizenId) query = query.eq('citizen_id', citizenId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[WatchlistService] Supabase getWatchlist failed:', err.message);
      }
    }

    let list = mockStore.watchlist || [];
    if (citizenId) list = list.filter(w => (w.citizenId || w.userId) === citizenId);
    return list;
  },

  addToWatchlist: async ({ citizenId, parcelId, label }) => {
    const newEntry = {
      id: `WL-${Date.now()}`,
      citizenId,
      parcelId,
      label: label || 'Monitored Parcel',
      notifyMutations: true,
      notifyEncumbrances: true,
      notifyCourtCases: true,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('watchlist').insert({
          id: newEntry.id,
          citizen_id: citizenId,
          parcel_ulpin: parcelId,
          label: newEntry.label,
        });
      } catch (err) {
        console.warn('[WatchlistService] Supabase insert failed:', err.message);
      }
    }

    if (mockStore.watchlist) {
      mockStore.watchlist.push(newEntry);
    }
    return newEntry;
  },

  removeFromWatchlist: async (id) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('watchlist').delete().eq('id', id);
      } catch (err) {
        console.warn('[WatchlistService] Supabase delete failed:', err.message);
      }
    }

    if (mockStore.watchlist) {
      mockStore.watchlist = mockStore.watchlist.filter(w => w.id !== id && w.parcelId !== id);
    }
    return { success: true, id };
  },
};
