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

  getPendingMutations: async () => {
    return apiClient.get('mutations', { status: 'PENDING' });
  },

  createMutation: async (payload) => {
    return apiClient.post('mutations', payload);
  },

  updateMutationStatus: async (id, payload) => {
    return apiClient.patch(`mutations/${encodeURIComponent(id)}/status`, payload);
  },

  getTalathiQueue: async (villageCode) => {
    return apiClient.get('mutations/queues/talathi', { villageCode });
  },

  getTehsildarQueue: async (tehsilCode) => {
    return apiClient.get('mutations/queues/tehsildar', { tehsilCode });
  },

  getSroAudits: async (sroCode) => {
    return apiClient.get('mutations/sro-audits', { sroCode });
  },
};

export default mutationService;
