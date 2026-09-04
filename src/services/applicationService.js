import applicationsData from '../data/applications/applications.json';
import applicationTypesData from '../data/applications/applicationTypes.json';

/**
 * Service to fetch and manage citizen service applications
 */
export const applicationService = {
  getApplications: async () => {
    return applicationsData;
  },

  getApplicationById: async (id) => {
    return applicationsData.find((a) => a.id === id) || null;
  },

  getApplicationsByCitizen: async (citizenId) => {
    return applicationsData.filter((a) => a.citizenId === citizenId);
  },

  getApplicationTypes: async () => {
    return applicationTypesData;
  },
};

export default applicationService;
