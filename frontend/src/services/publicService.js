import apiClient from '../api/client';

/**
 * Service to fetch public land portal data via backend REST API
 */
export const publicService = {
  getServices: async () => {
    return apiClient.get('public/services');
  },

  getNews: async () => {
    return apiClient.get('public/news');
  },

  getNotices: async () => {
    return apiClient.get('public/notices');
  },

  getJurisdictions: async () => {
    return apiClient.get('public/jurisdictions');
  },
};

export default publicService;
