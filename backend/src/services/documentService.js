import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../data/mockStore.js';

export const documentService = {
  getDocuments: async ({ userId } = {}) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('documents').select('*');
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[DocumentService] Supabase getDocuments failed:', err.message);
      }
    }

    let list = mockStore.documents || [];
    if (userId) list = list.filter(d => d.userId === userId);
    return list;
  },

  getDocumentById: async (id) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DocumentService] Supabase getDocumentById failed:', err.message);
      }
    }
    return (mockStore.documents || []).find(d => d.id === id) || null;
  },
};
