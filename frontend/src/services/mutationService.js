import apiClient from '../api/client';

/**
 * Service to fetch and manage e-Ferfar mutation workflows via backend REST API
 */
export const mutationService = {
  getMutations: async (params = {}) => {
    return apiClient.get('mutations', params);
  },

  getMutationById: async (id) => {
    if (!id) return null;
    return apiClient.get(`mutations/${encodeURIComponent(id)}`);
  },

  getMutationTimeline: async (mutationId) => {
    return apiClient.get(`mutations/${encodeURIComponent(mutationId)}/timeline`);
  },

  getMutationsByParcel: async (parcelId) => {
    return apiClient.get('mutations', { parcelId });
  },

  getMutationsByApplicant: async (applicantId) => {
    return apiClient.get('mutations', { applicantId });
  },

  getPendingMutations: async () => {
    return apiClient.get('mutations', { status: 'PENDING' });
  },

  createMutation: async (payload) => {
    return apiClient.post('mutations', payload);
  },

  executeAction: async (id, action, payload = {}) => {
    return apiClient.post(`mutations/${encodeURIComponent(id)}/actions/${encodeURIComponent(action)}`, payload);
  },

  approveMutation: async (id, payload = {}) => {
    return apiClient.post(`mutations/${encodeURIComponent(id)}/approve`, payload);
  },

  fieldVerify: async (id, payload = {}) => {
    return apiClient.post(`mutations/${encodeURIComponent(id)}/field-verify`, payload);
  },

  rejectMutation: async (id, payload = {}) => {
    return apiClient.post(`mutations/${encodeURIComponent(id)}/reject`, payload);
  },

  recordObjection: async (id, payload = {}) => {
    return apiClient.post(`mutations/${encodeURIComponent(id)}/objection`, payload);
  },

  // Statutory Cases / Dossier
  getOfficerQueue: async (params = {}) => {
    return apiClient.get('cases/queue', params);
  },

  getCaseDossier: async (id) => {
    return apiClient.get(`cases/${encodeURIComponent(id)}/dossier`);
  },

  // Backward compatibility aliases
  getTalathiQueue: async () => {
    return apiClient.get('cases/queue');
  },

  getTehsildarQueue: async () => {
    return apiClient.get('cases/queue');
  },

  getSroAudits: async (sroCode) => {
    return apiClient.get('cases/queue', { role: 'SRO', sroCode });
  },
};

export default mutationService;
