import apiClient from '../api/client';

/**
 * Service to handle authentication, role lookup, and profiles via backend REST API
 */
export const authService = {
  getMockCitizen: async (id = 'CIT-001') => {
    return apiClient.get(`auth/citizens/${encodeURIComponent(id)}`);
  },

  getMockGovernmentUser: async (role = 'TEHSILDAR') => {
    const list = await apiClient.get(`auth/roles/${encodeURIComponent(role)}`);
    return Array.isArray(list) && list.length > 0 ? list[0] : null;
  },

  getMockUser: async () => {
    return apiClient.get('auth/citizens/CIT-001');
  },

  getUsersByRole: async (role) => {
    return apiClient.get(`auth/roles/${encodeURIComponent(role)}`);
  },

  loginCitizen: async ({ identifier }) => {
    return apiClient.post('auth/login-citizen', { identifier });
  },

  loginOfficer: async ({ identifier, role }) => {
    return apiClient.post('auth/login-officer', { identifier, role });
  },
};

export default authService;
