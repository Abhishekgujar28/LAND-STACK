import { mockStore } from '../data/mockStore.js';

export const publicService = {
  getServices: async () => {
    return mockStore.services || [];
  },

  getNews: async () => {
    return mockStore.news || [];
  },

  getNotices: async () => {
    return mockStore.notices || [];
  },

  getJurisdictions: async () => {
    return {
      states: mockStore.states || [],
      districts: mockStore.districts || [],
      tehsils: mockStore.tehsils || [],
      villages: mockStore.villages || [],
    };
  },
};
