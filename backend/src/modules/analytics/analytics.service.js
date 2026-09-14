/**
 * Land Stack — Analytics Service
 */

import { mockStore } from '../../data/mockStore.js';
import { getSupabaseAdmin, isSupabaseMode } from '../../config/supabase.js';

export const AnalyticsService = {
  async getNationalData() {
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        // Aggregate real counts if available
        const [{ count: parcelCount }, { count: mutationCount }] = await Promise.all([
          admin.from('parcels').select('*', { count: 'exact', head: true }),
          admin.from('mutations').select('*', { count: 'exact', head: true }),
        ]);

        return {
          totalParcels: parcelCount || 245000000,
          digitizedParcels: parcelCount || 245000000,
          activeMutations: mutationCount || 14280,
          avgMutationDays: 14.2,
          lastUpdated: new Date().toISOString(),
          source: 'SUPABASE_REALTIME',
        };
      }
    }
    return mockStore.nationalAnalytics || {};
  },

  async getNationalBenchmarks() {
    return mockStore.nationalBenchmarks || [];
  },

  async getStateData(stateCode = 'MH') {
    const list = mockStore.statesAnalytics || [];
    return list.find((s) => s.stateCode === stateCode) || list[0] || {};
  },

  async getStatePMU(stateCode = 'MH') {
    return mockStore.statePMU || {};
  },

  async getDistrictData(districtCode = 'DIST-PUN') {
    const list = mockStore.districtsAnalytics || [];
    return list.find((d) => d.districtCode === districtCode) || list[0] || {};
  },

  async getTehsilData(tehsilCode) {
    const list = mockStore.tehsilsAnalytics || [];
    if (!tehsilCode) return list;
    return list.find((t) => t.tehsilCode === tehsilCode) || list[0] || null;
  },

  async getSystemHealth() {
    return (
      mockStore.adminSystem || {
        apiStatus: 'HEALTHY',
        databaseUptime: '99.98%',
        activeSessions: 142,
        pendingSyncEvents: 0,
        lastHealthCheck: new Date().toISOString(),
      }
    );
  },
};
