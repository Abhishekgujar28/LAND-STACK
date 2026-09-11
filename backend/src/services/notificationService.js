import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../data/mockStore.js';

export const notificationService = {
  getNotifications: async (userId) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[NotificationService] Supabase getNotifications failed:', err.message);
      }
    }

    let list = mockStore.notifications || [];
    if (userId) list = list.filter(n => n.userId === userId);
    return list;
  },

  markAsRead: async (id) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      } catch (err) {
        console.warn('[NotificationService] Supabase markAsRead failed:', err.message);
      }
    }

    const item = (mockStore.notifications || []).find(n => n.id === id);
    if (item) item.read = true;
    return item || { id, read: true };
  },
};
