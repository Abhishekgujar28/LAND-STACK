import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../data/mockStore.js';

export const applicationService = {
  getApplications: async ({ citizenId, status } = {}) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('applications').select('*, application_types(*)');
        if (citizenId) query = query.eq('citizen_id', citizenId);
        if (status) query = query.eq('status', status);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[ApplicationService] Supabase getApplications failed:', err.message);
      }
    }

    let list = mockStore.applications || [];
    if (citizenId) list = list.filter(a => a.citizenId === citizenId);
    if (status) list = list.filter(a => a.status === status);
    return list;
  },

  getApplicationById: async (id) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*, application_types(*)')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[ApplicationService] Supabase getApplicationById failed:', err.message);
      }
    }
    return (mockStore.applications || []).find(a => a.id === id) || null;
  },

  getApplicationTypes: async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('application_types').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[ApplicationService] Supabase getApplicationTypes failed:', err.message);
      }
    }
    return mockStore.applicationTypes || [];
  },

  createApplication: async (payload) => {
    const newId = `APP-${Date.now()}`;
    const newApp = {
      id: newId,
      applicationNumber: `APP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      typeCode: payload.typeCode || 'SRV-001',
      citizenId: payload.citizenId,
      parcelId: payload.parcelId || payload.parcelUlpin,
      status: 'SUBMITTED',
      submissionDate: new Date().toISOString(),
      feeAmount: payload.feeAmount || 0,
      paymentStatus: 'PAID',
      formData: payload.formData || {},
      trackingHistory: [
        {
          step: 1,
          title: 'Application Submitted',
          description: 'Application successfully received by system',
          date: new Date().toISOString(),
          status: 'COMPLETED',
        },
      ],
    };

    if (mockStore.applications) {
      mockStore.applications.unshift(newApp);
    }
    return newApp;
  },
};
