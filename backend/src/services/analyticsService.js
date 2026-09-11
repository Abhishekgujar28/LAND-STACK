import { mockStore } from '../data/mockStore.js';

export const analyticsService = {
  getNationalData: async () => {
    return mockStore.nationalAnalytics || {};
  },

  getNationalBenchmarks: async () => {
    return mockStore.nationalBenchmarks || [];
  },

  getStateData: async (stateCode = 'MH') => {
    const list = mockStore.statesAnalytics || [];
    return list.find(s => s.stateCode === stateCode) || list[0] || {};
  },

  getStatePMUData: async (stateCode = 'MH') => {
    return mockStore.statePMU || {};
  },

  getDistrictData: async (districtCode = 'DIST-PUN') => {
    const list = mockStore.districtsAnalytics || [];
    return list.find(d => d.districtCode === districtCode) || list[0] || {};
  },

  getTehsilData: async (tehsilCode) => {
    const list = mockStore.tehsilsAnalytics || [];
    if (!tehsilCode) return list;
    return list.find(t => t.tehsilCode === tehsilCode) || list[0] || null;
  },

  getSystemHealth: async () => {
    return mockStore.adminSystem || {};
  },
};
