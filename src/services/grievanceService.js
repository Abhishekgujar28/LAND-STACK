import grievancesData from '../data/grievances/grievances.json';

/**
 * Service to manage citizen grievances
 */
export const grievanceService = {
  getGrievances: async () => {
    return grievancesData;
  },

  getGrievancesByCitizen: async (citizenId) => {
    return grievancesData.filter((g) => g.citizenId === citizenId);
  },

  getGrievanceById: async (id) => {
    return grievancesData.find((g) => g.id === id) || null;
  },
};

export default grievanceService;
