import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../data/mockStore.js';

export const mutationService = {
  getMutations: async ({ parcelId, tehsilCode, status, applicantId } = {}) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('mutations').select('*, mutation_timeline(*)');
        if (parcelId) query = query.ilike('parcel_ulpin', parcelId);
        if (tehsilCode) query = query.eq('tehsil_code', tehsilCode);
        if (status) query = query.eq('status', status);
        if (applicantId) query = query.eq('applicant_id', applicantId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[MutationService] Supabase getMutations failed:', err.message);
      }
    }

    let list = mockStore.mutations || [];
    if (parcelId) {
      list = list.filter(m => (m.parcelId || m.parcelUlpin || '').toLowerCase() === parcelId.toLowerCase());
    }
    if (tehsilCode) {
      list = list.filter(m => m.tehsilCode === tehsilCode);
    }
    if (status) {
      list = list.filter(m => m.status === status);
    }
    if (applicantId) {
      list = list.filter(m => m.applicantId === applicantId);
    }
    return list;
  },

  getMutationById: async (id) => {
    if (!id) return null;
    const cleanId = id.trim();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('mutations')
          .select('*, mutation_timeline(*)')
          .or(`id.eq.${cleanId},mutation_number.eq.${cleanId}`)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[MutationService] Supabase getMutationById failed:', err.message);
      }
    }

    const mutation = (mockStore.mutations || []).find(
      m => m.id === cleanId || m.mutationNumber === cleanId
    );
    if (!mutation) return null;

    const timelineRecord = (mockStore.mutationTimeline || []).find(
      t => t.mutationId === mutation.id
    );
    return {
      ...mutation,
      timeline: timelineRecord ? timelineRecord.steps : [],
    };
  },

  getMutationTimeline: async (mutationId) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('mutation_timeline')
          .select('*')
          .eq('mutation_id', mutationId)
          .order('step_number', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[MutationService] Supabase getTimeline failed:', err.message);
      }
    }

    const record = (mockStore.mutationTimeline || []).find(t => t.mutationId === mutationId);
    return record ? record.steps : [];
  },

  getTalathiQueue: async (villageCode) => {
    let list = mockStore.talathiQueue || [];
    if (villageCode) {
      list = list.filter(item => item.villageCode === villageCode);
    }
    return list;
  },

  getTehsildarQueue: async (tehsilCode) => {
    let list = mockStore.tehsildarQueue || [];
    if (tehsilCode) {
      list = list.filter(item => item.tehsilCode === tehsilCode);
    }
    return list;
  },

  getSroAudits: async (sroCode) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('sro_audits').select('*');
        if (sroCode) query = query.eq('sro_code', sroCode);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[MutationService] Supabase getSroAudits failed:', err.message);
      }
    }

    let list = mockStore.sroAudits || [];
    if (sroCode) {
      list = list.filter(s => s.sroCode === sroCode);
    }
    return list;
  },

  createMutation: async (payload) => {
    const newId = `MUT-${Date.now()}`;
    const newMutation = {
      id: newId,
      mutationNumber: `MUT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      parcelId: payload.parcelId || payload.parcelUlpin,
      type: payload.type || 'Sale Deed Mutation',
      mutationType: payload.type || 'Sale Deed Mutation',
      applicantId: payload.applicantId,
      applicantName: payload.applicantName,
      initiatedBy: `${payload.applicantId || 'CITIZEN'} (${payload.applicantName || 'Citizen'})`,
      buyerName: payload.buyerName || payload.applicantName,
      sellerName: payload.sellerName,
      status: 'PENDING',
      appliedDate: new Date().toISOString(),
      filingDate: new Date().toISOString().split('T')[0],
      noticePeriodEnded: false,
      assignedOfficer: 'GOV-002 (Prakash Shinde)',
      slaDays: 30,
      slaDeadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      currentStep: 1,
      totalSteps: 6,
      remarks: payload.remarks || 'Application submitted via citizen portal',
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('mutations').insert({
          id: newMutation.id,
          mutation_number: newMutation.mutationNumber,
          parcel_ulpin: newMutation.parcelId,
          type: newMutation.type,
          applicant_id: newMutation.applicantId,
          applicant_name: newMutation.applicantName,
          buyer_name: newMutation.buyerName,
          seller_name: newMutation.sellerName,
          status: newMutation.status,
          applied_date: newMutation.appliedDate,
          sla_days: newMutation.slaDays,
          sla_deadline: newMutation.slaDeadline,
          current_step: newMutation.currentStep,
          total_steps: newMutation.totalSteps,
          remarks: newMutation.remarks,
        });
      } catch (err) {
        console.warn('[MutationService] Supabase insert failed:', err.message);
      }
    }

    if (mockStore.mutations) {
      mockStore.mutations.unshift(newMutation);
    }
    return newMutation;
  },

  updateMutationStatus: async (id, { status, remarks, officerName, officerRole }) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('mutations')
          .update({ status, remarks, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        console.warn('[MutationService] Supabase update failed:', err.message);
      }
    }

    const item = (mockStore.mutations || []).find(m => m.id === id);
    if (item) {
      item.status = status;
      if (remarks) item.remarks = remarks;
    }
    return item || { id, status, remarks };
  },
};
