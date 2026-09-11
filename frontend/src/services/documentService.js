import apiClient from '../api/client';

/**
 * Service to fetch and manage citizen certificates and land records via backend REST API
 */
export const documentService = {
  getDocuments: async (params = {}) => {
    return apiClient.get('documents', params);
  },

  getDocumentsByUser: async (userId) => {
    return apiClient.get('documents', { userId });
  },

  getDocumentById: async (id) => {
    if (!id) return null;
    return apiClient.get(`documents/${encodeURIComponent(id)}`);
  },
};

export default documentService;
