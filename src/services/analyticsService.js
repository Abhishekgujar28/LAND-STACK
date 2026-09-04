import nationalAnalytics from '../data/analytics/national.json';
import stateAnalytics from '../data/analytics/states.json';
import districtAnalytics from '../data/analytics/districts.json';
import tehsilAnalytics from '../data/analytics/tehsils.json';

/**
 * Service to aggregate dashboard and cadastral monitoring KPIs
 */
export const analyticsService = {
  getNationalData: async () => {
    return nationalAnalytics;
  },

  getStateData: async (stateCode = 'MH') => {
    return stateAnalytics.find((s) => s.stateCode === stateCode) || stateAnalytics[0];
  },

  getDistrictData: async (districtCode = 'DIST-PUN') => {
    return districtAnalytics.find((d) => d.districtCode === districtCode) || districtAnalytics[0];
  },

  getTehsilData: async (tehsilCode) => {
    if (!tehsilCode) return tehsilAnalytics;
    return tehsilAnalytics.find((t) => t.tehsilCode === tehsilCode) || null;
  },

  getDashboardData: async (scope = 'district') => {
    if (scope === 'national') return nationalAnalytics;
    if (scope === 'state') return stateAnalytics[0];
    return districtAnalytics[0];
  },
};

export default analyticsService;
