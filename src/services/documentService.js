import documentsData from '../data/documents/documents.json';

/**
 * Service to fetch and manage citizen certificates and land records
 */
export const documentService = {
  getDocuments: async () => {
    return documentsData;
  },

  getDocumentsByUser: async (userId) => {
    return documentsData.filter((d) => d.userId === userId);
  },

  getDocumentById: async (id) => {
    return documentsData.find((d) => d.id === id) || null;
  },
};

export default documentService;
