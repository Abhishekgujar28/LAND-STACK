/**
 * Land Stack — Jurisdiction Service
 * 
 * Manages administrative territorial hierarchy (State → District → Sub-Division → Tehsil → Circle → Village).
 */

import { mockStore } from '../../data/mockStore.js';
import { getSupabaseAdmin, isSupabaseMode } from '../../config/supabase.js';

export const JurisdictionService = {
  async getStates() {
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { data, error } = await admin.from('states').select('*').order('name');
        if (!error && data) return data;
      }
    }
    return mockStore.states || [];
  },

  async getDistricts(stateCode) {
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        let query = admin.from('districts').select('*').order('name');
        if (stateCode) query = query.eq('state_code', stateCode);
        const { data, error } = await query;
        if (!error && data) return data;
      }
    }
    let list = mockStore.districts || [];
    if (stateCode) {
      list = list.filter((d) => (d.stateCode || d.state_code) === stateCode);
    }
    return list;
  },

  async getTehsils(districtCode) {
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        let query = admin.from('tehsils').select('*').order('name');
        if (districtCode) query = query.eq('district_code', districtCode);
        const { data, error } = await query;
        if (!error && data) return data;
      }
    }
    let list = mockStore.tehsils || [];
    if (districtCode) {
      list = list.filter((t) => (t.districtCode || t.district_code) === districtCode);
    }
    return list;
  },

  async getVillages(tehsilCode) {
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        let query = admin.from('villages').select('*').order('name');
        if (tehsilCode) query = query.eq('tehsil_code', tehsilCode);
        const { data, error } = await query;
        if (!error && data) return data;
      }
    }
    let list = mockStore.villages || [];
    if (tehsilCode) {
      list = list.filter((v) => (v.tehsilCode || v.tehsil_code) === tehsilCode);
    }
    return list;
  },

  async getFullHierarchy({ stateCode, districtCode, tehsilCode } = {}) {
    return {
      states: await this.getStates(),
      districts: await this.getDistricts(stateCode),
      tehsils: await this.getTehsils(districtCode),
      villages: await this.getVillages(tehsilCode),
    };
  },

  /**
   * Validate that child jurisdiction belongs to parent jurisdiction
   */
  async validateHierarchy({ stateCode, districtCode, tehsilCode, villageCode }) {
    if (villageCode && tehsilCode) {
      const villages = await this.getVillages(tehsilCode);
      const exists = villages.some((v) => (v.code || v.id) === villageCode);
      if (!exists) return false;
    }

    if (tehsilCode && districtCode) {
      const tehsils = await this.getTehsils(districtCode);
      const exists = tehsils.some((t) => (t.code || t.id) === tehsilCode);
      if (!exists) return false;
    }

    return true;
  },
};
