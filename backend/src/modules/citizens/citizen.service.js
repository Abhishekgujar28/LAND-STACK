/**
 * Land Stack — Citizen Management Service (Database-Only)
 */

import { Errors } from '../../core/errors.js';
import { UserTypes } from '../../core/permissions.js';
import { getSupabaseAdmin, getSupabaseAnon } from '../../config/supabase.js';
import { AuditService } from '../audit/audit.service.js';

export const CitizenService = {
  async getProfile(actor, client) {
    if (!actor || actor.userType !== UserTypes.CITIZEN) {
      throw Errors.forbidden('Citizen profile access requires citizen authentication');
    }

    const db = client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    const { data: citizen, error } = await db
      .from('citizens')
      .select('*')
      .eq('id', actor.userId)
      .maybeSingle();

    if (error || !citizen) {
      throw Errors.notFound('Citizen profile not found in database.');
    }

    const maskedMobile = citizen.mobile
      ? citizen.mobile.replace(/(\+?\d{2,4})\s?(\d{2})\d+(\d{2})/, '$1 $2****$3')
      : null;

    return {
      ...citizen,
      mobile: maskedMobile,
    };
  },

  async updateProfile(actor, { name, email, address }, client) {
    if (!actor || actor.userType !== UserTypes.CITIZEN) {
      throw Errors.forbidden('Citizen profile update requires citizen authentication');
    }

    const db = client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.trim().toLowerCase();
    if (address) updates.address = address.trim();
    updates.updated_at = new Date().toISOString();

    const { data, error } = await db
      .from('citizens')
      .update(updates)
      .eq('id', actor.userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('[CitizenService] Profile update error:', error.message);
      throw Errors.internal('Failed to update citizen profile in database.');
    }

    await AuditService.recordEvent({
      entityType: 'CITIZEN',
      entityId: actor.userId,
      action: 'PROFILE_UPDATED',
      actor,
      payload: updates,
    });

    return data || { id: actor.userId, ...updates };
  },

  async getMyParcels(actor, client) {
    if (!actor || actor.userType !== UserTypes.CITIZEN) {
      throw Errors.forbidden('Requires citizen authentication');
    }

    const db = client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    const citizenName = actor.name || '';
    const citizenId = actor.userId;

    // 1. Fetch ownership records
    let ownedUlpins = new Set();
    const { data: ownerships } = await db
      .from('ownership_records')
      .select('parcel_ulpin, owner_id, owner_name')
      .or(`owner_id.eq.${citizenId},owner_name.ilike.%${citizenName}%`);

    (ownerships || []).forEach((o) => {
      if (o.parcel_ulpin) ownedUlpins.add(o.parcel_ulpin);
    });

    // 2. Fetch parcels by owner name or ULPIN set
    let query = db.from('parcels').select('*');
    if (ownedUlpins.size > 0) {
      query = query.or(`current_owner.ilike.%${citizenName}%,ulpin.in.(${Array.from(ownedUlpins).join(',')})`);
    } else {
      query = query.ilike('current_owner', `%${citizenName}%`);
    }

    const { data: parcels, error } = await query;
    if (error) {
      console.error('[CitizenService] Error fetching parcels:', error.message);
      return [];
    }

    return parcels || [];
  },

  async getMyActivity(actor, client) {
    if (!actor || actor.userType !== UserTypes.CITIZEN) {
      throw Errors.forbidden('Requires citizen authentication');
    }

    const db = client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    const citizenId = actor.userId;
    const citizenName = actor.name || '';

    // Applications from DB
    const { data: applications } = await db
      .from('applications')
      .select('*')
      .eq('citizen_id', citizenId)
      .order('created_at', { ascending: false });

    // Mutations from DB
    const { data: mutations } = await db
      .from('mutations')
      .select('*')
      .or(`applicant_id.eq.${citizenId},applicant_name.ilike.%${citizenName}%,buyer_name.ilike.%${citizenName}%,seller_name.ilike.%${citizenName}%`)
      .order('created_at', { ascending: false });

    // Documents from DB
    const { data: documents } = await db
      .from('documents')
      .select('*')
      .eq('user_id', citizenId)
      .order('created_at', { ascending: false });

    const parcels = await this.getMyParcels(actor, client);
    const appList = applications || [];
    const mutList = mutations || [];
    const docList = documents || [];

    return {
      summary: {
        totalParcels: parcels.length,
        activeApplications: appList.filter((a) => a.status !== 'COMPLETED' && a.status !== 'REJECTED').length,
        pendingMutations: mutList.filter((m) => m.status !== 'APPROVED' && m.status !== 'CLOSED' && m.status !== 'REJECTED').length,
        totalDocuments: docList.length,
      },
      recentApplications: appList.slice(0, 5),
      recentMutations: mutList.slice(0, 5),
      recentDocuments: docList.slice(0, 5),
    };
  },
};
