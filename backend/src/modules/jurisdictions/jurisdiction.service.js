/**
 * Land Stack — Jurisdiction Service (Database-Only)
 * 
 * Manages administrative territorial hierarchy (State → District → Tehsil → Village)
 * directly queried from Supabase PostgreSQL tables.
 */

import { getSupabaseAdmin, getSupabaseAnon } from '../../config/supabase.js';
import { Errors } from '../../core/errors.js';

export const JurisdictionService = {
  async getStates(client) {
    const db = client || getSupabaseAdmin() || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');
    const { data, error } = await db.from('states').select('*').order('name');
    if (error) {
      console.error('[JurisdictionService] Error fetching states:', error.message);
      return [];
    }
    return data || [];
  },

  async getDistricts(stateCode, client) {
    const db = client || getSupabaseAdmin() || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');
    let query = db.from('districts').select('*').order('name');
    if (stateCode) query = query.eq('state_code', stateCode);
    const { data, error } = await query;
    if (error) {
      console.error('[JurisdictionService] Error fetching districts:', error.message);
      return [];
    }
    return data || [];
  },

  async getTehsils(districtCode, client) {
    const db = client || getSupabaseAdmin() || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');
    let query = db.from('tehsils').select('*').order('name');
    if (districtCode) query = query.eq('district_code', districtCode);
    const { data, error } = await query;
    if (error) {
      console.error('[JurisdictionService] Error fetching tehsils:', error.message);
      return [];
    }
    return data || [];
  },

  async getVillages(tehsilCode, client) {
    const db = client || getSupabaseAdmin() || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');
    let query = db.from('villages').select('*').order('name');
    if (tehsilCode) query = query.eq('tehsil_code', tehsilCode);
    const { data, error } = await query;
    if (error) {
      console.error('[JurisdictionService] Error fetching villages:', error.message);
      return [];
    }
    return data || [];
  },

  async getFullHierarchy({ stateCode, districtCode, tehsilCode } = {}, client) {
    return {
      states: await this.getStates(client),
      districts: await this.getDistricts(stateCode, client),
      tehsils: await this.getTehsils(districtCode, client),
      villages: await this.getVillages(tehsilCode, client),
    };
  },

  async validateHierarchy({ stateCode, districtCode, tehsilCode, villageCode }, client) {
    if (villageCode && tehsilCode) {
      const villages = await this.getVillages(tehsilCode, client);
      const exists = villages.some((v) => (v.code || v.id) === villageCode);
      if (!exists) return false;
    }

    if (tehsilCode && districtCode) {
      const tehsils = await this.getTehsils(districtCode, client);
      const exists = tehsils.some((t) => (t.code || t.id) === tehsilCode);
      if (!exists) return false;
    }

    return true;
  },
};
