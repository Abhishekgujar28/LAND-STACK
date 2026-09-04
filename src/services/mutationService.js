import mutationsData from '../data/mutations/mutations.json';
import timelineData from '../data/mutations/mutationTimeline.json';

/**
 * Service to fetch and manage e-Ferfar mutation workflows
 */
export const mutationService = {
  getMutations: async () => {
    return mutationsData;
  },

  getMutationById: async (id) => {
    return mutationsData.find((m) => m.id === id || m.mutationNumber === id) || null;
  },

  getMutationTimeline: async (mutationId) => {
    const record = timelineData.find((t) => t.mutationId === mutationId);
    return record ? record.steps : [];
  },

  getMutationsByParcel: async (parcelId) => {
    return mutationsData.filter((m) => m.parcelId.toLowerCase() === parcelId.toLowerCase());
  },

  getPendingMutations: async () => {
    return mutationsData.filter((m) => m.status === 'PENDING');
  },
};

export default mutationService;
