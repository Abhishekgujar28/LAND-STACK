import apiClient from '../api/client';

/**
 * Service to fetch and manage citizen service applications via backend REST API
 */
export const applicationService = {
  getApplications: async (params = {}) => {
    return apiClient.get('applications', params);
  },

  getApplicationById: async (id) => {
    if (!id) return null;
    return apiClient.get(`applications/${encodeURIComponent(id)}`);
  },

  getApplicationsByCitizen: async (citizenId) => {
    return apiClient.get('applications', { citizenId });
  },

  getApplicationTypes: async () => {
    return apiClient.get('applications/types');
  },

  createApplication: async (payload) => {
    return apiClient.post('applications', payload);
  },
};

export default applicationService;
