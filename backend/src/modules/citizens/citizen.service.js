/**
 * Land Stack — Citizen Management Service
 */

import { Errors } from '../../core/errors.js';
import { UserTypes } from '../../core/permissions.js';
import { mockStore } from '../../data/mockStore.js';
import { getSupabaseAdmin, isSupabaseMode } from '../../config/supabase.js';
import { AuditService } from '../audit/audit.service.js';

export const CitizenService = {
  async getProfile(actor) {
    if (!actor || actor.userType !== UserTypes.CITIZEN) {
      throw Errors.forbidden('Citizen profile access requires citizen authentication');
    }

    let citizen = null;
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { data } = await admin
          .from('citizens')
          .select('id, mobile, email, name, address, created_at')
          .eq('id', actor.userId)
          .maybeSingle();
        citizen = data;
      }
    }

    if (!citizen) {
      citizen = (mockStore.citizens || []).find((c) => c.id === actor.userId) || {
        id: actor.userId,
        name: actor.name || 'Citizen User',
        mobile: actor.phone || '+91 98765 43210',
        email: actor.email || 'citizen@example.com',
        address: 'Pune, Maharashtra',
      };
    }

    // Mask sensitive fields
    const maskedMobile = citizen.mobile
      ? citizen.mobile.replace(/(\+?\d{2,4})\s?(\d{2})\d+(\d{2})/, '$1 $2****$3')
      : null;

    return {
      ...citizen,
      mobile: maskedMobile,
    };
  },

  async updateProfile(actor, { name, email, address }) {
    if (!actor || actor.userType !== UserTypes.CITIZEN) {
      throw Errors.forbidden('Citizen profile update requires citizen authentication');
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.trim().toLowerCase();
    if (address) updates.address = address.trim();

    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        await admin
          .from('citizens')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', actor.userId);
      }
    } else {
      const citizen = (mockStore.citizens || []).find((c) => c.id === actor.userId);
      if (citizen) {
        Object.assign(citizen, updates);
      }
    }

    await AuditService.recordEvent({
      entityType: 'CITIZEN',
      entityId: actor.userId,
      action: 'PROFILE_UPDATED',
      actor,
      payload: updates,
    });

    return {
      id: actor.userId,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  },

  async getMyParcels(actor) {
    if (!actor || actor.userType !== UserTypes.CITIZEN) {
      throw Errors.forbidden('Requires citizen authentication');
    }

    const citizenName = (actor.name || '').toLowerCase();
    const citizenId = actor.userId;

    // Check ownership table or parcels matching name
    const ownerships = (mockStore.ownership || []).filter(
      (o) =>
        (o.ownerId && o.ownerId === citizenId) ||
        (o.ownerName && o.ownerName.toLowerCase().includes(citizenName))
    );

    const ownedUlpins = new Set(ownerships.map((o) => o.parcelId));

    const parcels = (mockStore.parcels || []).filter((p) => {
      if (ownedUlpins.has(p.ulpin || p.id)) return true;
      if (p.current_owner && p.current_owner.toLowerCase().includes(citizenName)) return true;
      return false;
    });

    return parcels;
  },

  async getMyActivity(actor) {
    if (!actor || actor.userType !== UserTypes.CITIZEN) {
      throw Errors.forbidden('Requires citizen authentication');
    }

    const applications = (mockStore.applications || []).filter(
      (a) => (a.citizenId || a.citizen_id) === actor.userId
    );
    const mutations = (mockStore.mutations || []).filter(
      (m) =>
        (m.applicantId || m.applicant_id) === actor.userId ||
        (m.initiatedBy || '').toLowerCase().includes(actor.name?.toLowerCase() || '')
    );
    const documents = (mockStore.documents || []).filter(
      (d) => (d.userId || d.user_id) === actor.userId
    );

    return {
      summary: {
        totalParcels: (await this.getMyParcels(actor)).length,
        activeApplications: applications.filter((a) => a.status !== 'COMPLETED' && a.status !== 'REJECTED').length,
        pendingMutations: mutations.filter((m) => m.status !== 'APPROVED' && m.status !== 'CLOSED').length,
        totalDocuments: documents.length,
      },
      recentApplications: applications.slice(0, 5),
      recentMutations: mutations.slice(0, 5),
      recentDocuments: documents.slice(0, 5),
    };
  },
};
