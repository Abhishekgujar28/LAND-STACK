import apiClient from '../api/client';

/**
 * Service to aggregate dashboard and cadastral monitoring KPIs via backend REST API
 */
export const analyticsService = {
  getNationalData: async () => {
    return apiClient.get('analytics/national');
  },

  getNationalBenchmarks: async () => {
    return apiClient.get('analytics/benchmarks');
  },

  getStateData: async (stateCode = 'MH') => {
    return apiClient.get(`analytics/state/${encodeURIComponent(stateCode)}`);
  },

  getStatePMUData: async (stateCode = 'MH') => {
    return apiClient.get(`analytics/state/${encodeURIComponent(stateCode)}/pmu`);
  },

  getDistrictData: async (districtCode = 'DIST-PUN') => {
    return apiClient.get(`analytics/district/${encodeURIComponent(districtCode)}`);
  },

  getTehsilData: async (tehsilCode) => {
    if (!tehsilCode) return apiClient.get('analytics/tehsils');
    return apiClient.get(`analytics/tehsil/${encodeURIComponent(tehsilCode)}`);
  },

  getSystemHealth: async () => {
    return apiClient.get('analytics/system-health');
  },

  getDashboardData: async (scope = 'district') => {
    if (scope === 'national') return analyticsService.getNationalData();
    if (scope === 'state') return analyticsService.getStateData();
    return analyticsService.getDistrictData();
  },
};

export default analyticsService;
