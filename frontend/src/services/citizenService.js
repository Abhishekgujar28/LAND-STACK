import apiClient from '../api/client';

/**
 * Service to manage authenticated Citizen operations via backend REST API
 * Database-Only (Backed by PostgreSQL ownership_records + parcels)
 */
export const citizenService = {
  /**
   * Get all land parcels legally owned by the authenticated citizen
   */
  getMyParcels: async () => {
    return apiClient.get('citizens/parcels');
  },

  /**
   * Get authenticated citizen profile
   */
  getProfile: async () => {
    return apiClient.get('citizens/profile');
  },

  /**
   * Update authenticated citizen profile
   */
  updateProfile: async (profileData) => {
    return apiClient.put('citizens/profile', profileData);
  },

  /**
   * Get unified activity feed for the authenticated citizen
   */
  getMyActivity: async () => {
    return apiClient.get('citizens/activity');
  },
};

export default citizenService;
