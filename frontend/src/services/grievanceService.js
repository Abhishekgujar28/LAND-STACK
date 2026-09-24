import apiClient from '../api/client';

/**
 * Service to manage citizen grievances via backend REST API
 */
export const grievanceService = {
  getGrievances: async (params = {}) => {
    return apiClient.get('grievances', params);
  },

  getGrievancesByCitizen: async (citizenId) => {
    return apiClient.get('grievances', { citizenId });
  },

  getGrievanceById: async (id) => {
    if (!id) return null;
    return apiClient.get(`grievances/${encodeURIComponent(id)}`);
  },

  createGrievance: async (payload) => {
    return apiClient.post('grievances', payload);
  },

  lodgeGrievance: async (payload) => {
    return apiClient.post('grievances', payload);
  },
};

export default grievanceService;
