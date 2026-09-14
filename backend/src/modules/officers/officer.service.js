/**
 * Land Stack — Officer Service
 */

import { Errors } from '../../core/errors.js';
import { UserTypes } from '../../core/permissions.js';
import { mockStore } from '../../data/mockStore.js';
import { getSupabaseAdmin, isSupabaseMode } from '../../config/supabase.js';

export const OfficerService = {
  async getProfile(officer) {
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

  async listOfficers({ role, department, tehsilCode, villageCode } = {}) {
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        let query = admin
          .from('officers')
          .select('id, name, email, role, department_code, is_active');
        if (role) query = query.eq('role', role);
        if (department) query = query.eq('department_code', department);
        const { data } = await query;
        if (data) return data;
      }
    }

    let list = mockStore.governmentUsers || [];
    if (role) list = list.filter((o) => o.role === role);
    if (department) list = list.filter((o) => o.department === department);
    return list.map((o) => ({
      id: o.id,
      name: o.name,
      role: o.role,
      department: o.department,
      jurisdiction: o.jurisdiction,
    }));
  },
};
