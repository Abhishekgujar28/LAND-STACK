import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../data/mockStore.js';

export const authService = {
  loginCitizen: async ({ identifier }) => {
    const cleanId = (identifier || '').trim();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('citizens')
          .select('*')
          .or(`mobile.eq.${cleanId},email.eq.${cleanId},id.eq.${cleanId}`)
          .maybeSingle();
        if (!error && data) {
          return { success: true, user: data, role: 'CITIZEN' };
        }
      } catch (err) {
        console.warn('[AuthService] Supabase citizen lookup failed:', err.message);
      }
    }

    const citizens = mockStore.citizens || [];
    const user =
      citizens.find(
        c =>
          c.mobile.includes(cleanId) ||
          c.email === cleanId ||
          c.id === cleanId
      ) || citizens[0];

    return { success: true, user, role: 'CITIZEN' };
  },

  loginOfficer: async ({ identifier, role }) => {
    const cleanId = (identifier || '').trim();

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('government_users').select('*, government_roles(*)');
        if (cleanId) {
          query = query.or(`email.eq.${cleanId},id.eq.${cleanId}`);
        } else if (role) {
          query = query.eq('role', role);
        }
        const { data, error } = await query.limit(1).maybeSingle();
        if (!error && data) {
          return { success: true, user: data, role: data.role };
        }
      } catch (err) {
        console.warn('[AuthService] Supabase officer lookup failed:', err.message);
      }
    }

    const officers = mockStore.governmentUsers || [];
    const user =
      officers.find(
        g => g.id === cleanId || g.email === cleanId || (role && g.role === role)
      ) || officers[0];

    return { success: true, user, role: user.role };
  },

  getCitizenById: async (id) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('citizens')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[AuthService] Supabase getCitizenById failed:', err.message);
      }
    }
    return (mockStore.citizens || []).find(c => c.id === id) || null;
  },

  getOfficerById: async (id) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('government_users')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[AuthService] Supabase getOfficerById failed:', err.message);
      }
    }
    return (mockStore.governmentUsers || []).find(g => g.id === id) || null;
  },

  getUsersByRole: async (role) => {
    if (role === 'CITIZEN') {
      return mockStore.citizens || [];
    }
    return (mockStore.governmentUsers || []).filter(u => u.role === role);
  },
};
