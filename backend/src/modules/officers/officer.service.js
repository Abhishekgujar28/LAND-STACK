/**
 * Land Stack — Officer Service (Database-Only)
 */

import { Errors } from '../../core/errors.js';
import { UserTypes } from '../../core/permissions.js';
import { getSupabaseAdmin, getSupabaseAnon } from '../../config/supabase.js';

export const OfficerService = {
  async getProfile(officer, client) {
    if (!officer || officer.userType !== UserTypes.GOVERNMENT) {
      throw Errors.forbidden('Requires government officer credentials');
    }

    return {
      id: officer.userId,
      name: officer.name,
      email: officer.email,
      role: officer.role,
      department: officer.department,
      activeContext: officer.activeContext,
      jurisdiction: officer.jurisdiction,
      assignments: officer.assignments,
    };
  },

  async listOfficers({ role, department, tehsilCode, villageCode } = {}, client) {
    const db = client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database connection unavailable.');

    let query = db
      .from('government_users')
      .select('id, name, local_name, email, role, department_code, designation, state_code, district_code, tehsil_code, village_code, active')
      .eq('active', true);

    if (role) query = query.eq('role', role);
    if (department) query = query.eq('department_code', department);
    if (tehsilCode) query = query.eq('tehsil_code', tehsilCode);
    if (villageCode) query = query.eq('village_code', villageCode);

    const { data, error } = await query;
    if (error) {
      console.error('[OfficerService] Error listing officers:', error.message);
      throw Errors.internal('Failed to query officers from database.');
    }

    return (data || []).map((o) => ({
      id: o.id,
      name: o.name,
      localName: o.local_name,
      email: o.email,
      role: o.role,
      department: o.department_code,
      designation: o.designation,
      jurisdiction: {
        stateCode: o.state_code,
        districtCode: o.district_code,
        tehsilCode: o.tehsil_code,
        villageCode: o.village_code,
      },
    }));
  },
};
