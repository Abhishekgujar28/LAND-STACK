import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../data/mockStore.js';

export const grievanceService = {
  getGrievances: async ({ citizenId, status } = {}) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('grievances').select('*');
        if (citizenId) query = query.eq('citizen_id', citizenId);
        if (status) query = query.eq('status', status);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[GrievanceService] Supabase getGrievances failed:', err.message);
      }
    }

    let list = mockStore.grievances || [];
    if (citizenId) list = list.filter(g => g.citizenId === citizenId);
    if (status) list = list.filter(g => g.status === status);
    return list;
  },

  getGrievanceById: async (id) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('grievances')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[GrievanceService] Supabase getGrievanceById failed:', err.message);
      }
    }
    return (mockStore.grievances || []).find(g => g.id === id) || null;
  },

  createGrievance: async (payload) => {
    const newId = `GRV-${Date.now()}`;
    const newGrievance = {
      id: newId,
      grievanceNumber: `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      citizenId: payload.citizenId,
      parcelId: payload.parcelId || payload.parcelUlpin,
      category: payload.category || 'Revenue Records',
      subject: payload.subject,
      description: payload.description,
      status: 'OPEN',
      filedDate: new Date().toISOString(),
      departmentCode: payload.departmentCode || 'DEPT-REV',
      resolutionNotes: null,
      resolvedAt: null,
    };

    if (mockStore.grievances) {
      mockStore.grievances.unshift(newGrievance);
    }
    return newGrievance;
  },
};
