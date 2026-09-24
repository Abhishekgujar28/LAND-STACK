/**
 * Land Stack — Mutation Service (Database-Only)
 * 
 * Implements the 12-state mutation workflow with state machine validation,
 * permission enforcement, statutory audit recording, and PostgreSQL persistence.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  MutationStates,
  MutationActions,
  validateAction,
  getActionDef,
} from './mutation.statemachine.js';
import { Errors } from '../../core/errors.js';
import { Permissions, hasPermission, UserTypes, Roles } from '../../core/permissions.js';
import { getSupabaseAdmin, getSupabaseAnon } from '../../config/supabase.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationService } from '../notifications/notification.service.js';

export const MutationService = {
  /**
   * Create a new mutation application directly in PostgreSQL
   */
  async createMutation({ parcelUlpin, type, buyerName, sellerName, remarks, formData }, actor, client) {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    // 1. Verify parcel exists
    const admin = getSupabaseAdmin();
    const { data: parcel, error: parcelErr } = await (admin || db)
      .from('parcels')
      .select('ulpin, village_code, tehsil_code, district_code, state_code')
      .ilike('ulpin', parcelUlpin)
      .maybeSingle();

    if (parcelErr || !parcel) {
      throw Errors.notFound(`Parcel with ULPIN '${parcelUlpin}' not found in registry.`);
    }

    const mutationId = `MUT-${Date.now().toString().slice(-6)}`;
    const mutationNumber = `FERFAR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const initialState = MutationStates.INITIATED;
    const now = new Date().toISOString();

    if (!actor || !actor.userId) {
      throw Errors.unauthenticated('Actor missing or invalid');
    }

    const newRecord = {
      id: mutationId,
      mutation_number: mutationNumber,
      parcel_ulpin: parcel.ulpin,
      type: type || 'Sale Deed / Kharedi Khat',
      status: initialState,
      applicant_id: actor.userId,
      applicant_name: actor.name || buyerName || 'Citizen Applicant',
      buyer_name: buyerName || actor.name || '',
      seller_name: sellerName || '',
      remarks: remarks || 'Mutation application submitted',
      village_code: parcel.village_code,
      tehsil_code: parcel.tehsil_code,
      applied_date: now,
      sla_days: 30,
      current_step: 1,
      total_steps: 6,
      created_at: now,
      updated_at: now,
    };

    // Insert into database
    const { data: inserted, error: insertError } = await db
      .from('mutations')
      .insert(newRecord)
      .select()
      .single();

    if (insertError) {
      console.error('[MutationService] Error creating mutation in DB:', insertError.message);
      throw Errors.internal('Failed to record mutation in database: ' + insertError.message);
    }

    // Insert initial timeline entry into mutation_timeline
    await db.from('mutation_timeline').insert({
      id: `TL-${mutationId}-1`,
      mutation_id: mutationId,
      step_number: 1,
      title: 'Mutation Initiated',
      description: `Mutation request registered under statutory SLA (30 Days).`,
      completed: true,
      active: false,
      completed_at: now,
      officer_name: actor?.name || 'Citizen Applicant',
      officer_role: actor?.role || 'CITIZEN',
      created_at: now,
    });

    // Audit log
    await AuditService.recordEvent({
      entityType: 'MUTATION',
      entityId: mutationId,
      action: 'MUTATION_CREATED',
      actor,
      stateAfter: { status: initialState },
      payload: { parcelUlpin, type, buyerName, sellerName },
    });

    // Notification
    await NotificationService.send({
      recipientId: actor?.userId || 'CITIZEN',
      title: 'Mutation Initiated',
      message: `Your mutation application ${mutationNumber} for parcel ${parcelUlpin} has been registered.`,
      type: 'STATUS_UPDATE',
      entityType: 'MUTATION',
      entityId: mutationId,
    });

    return inserted || newRecord;
  },

  /**
   * Get list of mutations with role/jurisdiction-aware filtering
   */
  async getMutations({ parcelUlpin, tehsilCode, villageCode, status, applicantId, page = 1, limit = 20 }, actor, client) {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    let query = db
      .from('mutations')
      .select('*');

    if (parcelUlpin) query = query.ilike('parcel_ulpin', parcelUlpin);
    if (tehsilCode) query = query.eq('tehsil_code', tehsilCode);
    if (villageCode) query = query.eq('village_code', villageCode);
    if (status) query = query.eq('status', status);

    // Citizen only sees their own applications
    if (actor?.userType === UserTypes.CITIZEN) {
      query = query.or(`applicant_id.eq.${actor.userId},applicant_name.ilike.%${actor.name || ''}%`);
    } else if (applicantId) {
      query = query.eq('applicant_id', applicantId);
    }

    // Officer jurisdiction filtering
    if (actor?.userType === UserTypes.GOVERNMENT) {
      if ((actor.role === Roles.TALATHI || actor.role === Roles.PATWARI) && actor.jurisdiction?.villageCode) {
        query = query.eq('village_code', actor.jurisdiction.villageCode);
      } else if ((actor.role === Roles.TEHSILDAR || actor.role === Roles.CRO) && actor.jurisdiction?.tehsilCode) {
        query = query.eq('tehsil_code', actor.jurisdiction.tehsilCode);
      }
    }

    const offset = (page - 1) * limit;
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[MutationService] Error fetching mutations:', error.message);
      throw Errors.internal('Failed to fetch mutations from database: ' + error.message);
    }

    return {
      items: data || [],
      total: (data || []).length,
      page,
      limit,
    };
  },

  /**
   * Get single mutation by ID or mutation number
   */
  async getMutationById(mutationId, actor, client) {
    if (!mutationId) throw Errors.badRequest('Mutation ID is required');
    const cleanId = mutationId.trim();

    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    const { data: mutation, error } = await db
      .from('mutations')
      .select('*, mutation_timeline(*)')
      .or(`id.eq.${cleanId},mutation_number.eq.${cleanId}`)
      .maybeSingle();

    if (error || !mutation) {
      throw Errors.notFound(`Mutation '${cleanId}' not found in database.`);
    }

    // Server-Side Jurisdiction Enforcement for Government Officers
    if (actor && actor.userType === UserTypes.GOVERNMENT) {
      const j = actor.jurisdiction || {};
      const officerVillage = j.villageCode;
      const officerTehsil = j.tehsilCode;
      const officerDistrict = j.districtCode;
      const officerState = j.stateCode;

      const isNational = !officerState && !officerDistrict && !officerTehsil;
      const isState = officerState && !officerDistrict && !officerTehsil;

      if (!isNational) {
        if (isState && mutation.state_code && mutation.state_code !== officerState) {
          throw Errors.forbiddenJurisdiction(`You are not authorized to view mutations outside state ${officerState}.`);
        }
        if (officerDistrict && mutation.district_code && mutation.district_code !== officerDistrict) {
          throw Errors.forbiddenJurisdiction(`You are not authorized to view mutations outside district ${officerDistrict}.`);
        }
        if (officerTehsil && mutation.tehsil_code && mutation.tehsil_code !== officerTehsil) {
          throw Errors.forbiddenJurisdiction(`You are not authorized to view mutations outside tehsil ${officerTehsil}.`);
        }
        if (officerVillage && mutation.village_code && mutation.village_code !== officerVillage) {
          throw Errors.forbiddenJurisdiction(`You are not authorized to view mutations outside village ${officerVillage}.`);
        }
      }
    }

    const timeline = mutation.mutation_timeline || [];
    const auditTrail = await AuditService.getTrail('MUTATION', mutation.id);

    return {
      ...mutation,
      timeline,
      auditTrail,
    };
  },

  /**
   * Get mutation timeline
   */
  async getTimeline(mutationId, actor, client) {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) return [];
    const { data } = await db
      .from('mutation_timeline')
      .select('*')
      .eq('mutation_id', mutationId)
      .order('step_number', { ascending: true });
    return data || [];
  },

  /**
   * Execute state machine action transition directly in PostgreSQL
   */
  async executeAction(mutationId, action, options, client) {
    return this._executeActionInternal(mutationId, action, options, client);
  },

  async _executeActionInternal(mutationId, actionName, { actor, payload = {}, ipAddress, userAgent }, client) {
    const mutation = await this.getMutationById(mutationId, actor, client);
    const currentState = mutation.status;

    // 1. Validate action is known and valid in current state
    const actionValidation = validateAction(actionName, currentState);
    if (!actionValidation.valid) {
      throw Errors.conflict(actionValidation.reason);
    }
    const actionDef = actionValidation.action;

    // 2. Validate actor has required permission
    if (actionDef.permission) {
      // Statutory block: ADMIN role cannot approve or reject mutations
      if (actor?.role === Roles.ADMIN) {
        throw Errors.forbidden('Statutory Restriction: System Administrators are legally prohibited from sanctioning or rejecting revenue mutations.');
      }

      if (!hasPermission(actor?.role, actionDef.permission)) {
        throw Errors.forbidden(
          `Actor with role '${actor?.role}' does not have permission '${actionDef.permission}' to perform '${actionName}'.`
        );
      }
    }

    // 3. MFA Step-up check if required
    if (actionDef.requiresMfa) {
      const mfaToken = payload._mfaToken || payload.mfaToken;
      if (!mfaToken && !actor?.mfaVerified) {
        throw Errors.mfaRequired(`Statutory action '${actionName}' requires biometric / OTP MFA step-up.`);
      }
    }

    // 4. Jurisdiction check for officers
    if (actor?.userType === UserTypes.GOVERNMENT) {
      const officerVillage = actor.jurisdiction?.villageCode;
      const officerTehsil = actor.jurisdiction?.tehsilCode;
      const officerDistrict = actor.jurisdiction?.districtCode;
      const officerState = actor.jurisdiction?.stateCode;
      const mutVillage = mutation.village_code;
      const mutTehsil = mutation.tehsil_code;
      const mutDistrict = mutation.district_code;

      const isNational = !officerState && !officerDistrict && !officerTehsil;

      if (!isNational) {
        if ((actor.role === Roles.TALATHI || actor.role === Roles.PATWARI) && officerVillage && mutVillage && officerVillage !== mutVillage) {
          throw Errors.forbiddenJurisdiction(`Talathi jurisdiction (${officerVillage}) does not cover mutation village (${mutVillage}).`);
        }
        if ((actor.role === Roles.TEHSILDAR || actor.role === Roles.CRO) && officerTehsil && mutTehsil && officerTehsil !== mutTehsil) {
          throw Errors.forbiddenJurisdiction(`Tahsildar jurisdiction (${officerTehsil}) does not cover mutation tehsil (${mutTehsil}).`);
        }
        if ((actor.role === Roles.ULB_OFFICER || actor.role === Roles.COLLECTOR) && officerDistrict && mutDistrict && officerDistrict !== mutDistrict) {
          throw Errors.forbiddenJurisdiction(`Officer district jurisdiction (${officerDistrict}) does not cover mutation district (${mutDistrict}).`);
        }
      }
    }

    const nextState = actionDef.to;
    const now = new Date().toISOString();

    // 5. Update mutation state in database
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    const updateData = {
      status: nextState,
      updated_at: now,
    };
    if (payload.remarks) updateData.remarks = payload.remarks;

    const { error: updateErr } = await db
      .from('mutations')
      .update(updateData)
      .eq('id', mutation.id);

    if (updateErr) {
      console.error('[MutationService] Error updating mutation status:', updateErr.message);
      throw Errors.internal('Failed to update mutation status in database: ' + updateErr.message);
    }

    // 6. Record in mutation_timeline
    const stepDescription =
      payload.remarks ||
      payload.description ||
      payload.reason ||
      `Transitioned to ${nextState} via statutory action ${actionName}`;

    const stepNumber = (mutation.timeline?.length || 1) + 1;
    await db.from('mutation_timeline').insert({
      id: `TL-${mutation.id}-${stepNumber}-${Date.now().toString().slice(-4)}`,
      mutation_id: mutation.id,
      step_number: stepNumber,
      title: `${actionName.replace(/_/g, ' ')}`,
      description: stepDescription,
      completed: true,
      active: false,
      completed_at: now,
      officer_name: `${actor?.role || 'OFFICER'} (${actor?.name || 'Officer'})`,
      officer_role: actor?.role || 'OFFICER',
      created_at: now,
    });

    // 7. Record audit event
    await AuditService.recordEvent({
      entityType: 'MUTATION',
      entityId: mutation.id,
      action: `MUTATION_${actionName}`,
      actor,
      ipAddress,
      userAgent,
      stateBefore: { status: currentState },
      stateAfter: { status: nextState },
      payload: { action: actionName, ...payload },
    });

    // 8. Dispatch notification
    await NotificationService.sendNotification({
      recipientId: mutation.applicant_id || 'CITIZEN',
      title: `Mutation Status Updated: ${nextState}`,
      message: `Mutation ${mutation.mutation_number || mutation.id} has progressed to ${nextState}.`,
      type: 'STATUS_UPDATE',
      entityType: 'MUTATION',
      entityId: mutation.id,
    });

      return {
        id: mutation.id,
        mutationNumber: mutation.mutation_number,
        previousStatus: currentState,
        status: nextState,
        updatedAt: now,
      };
    },

    async scheduleHearing(id, { date, time, venue, officerId, _mfaToken, actor, ipAddress, userAgent }, client) {
      return this.executeAction(id, 'SCHEDULE_HEARING', {
        actor,
        payload: { date, time, venue, officerId, _mfaToken },
        ipAddress,
        userAgent,
      }, client);
    },

    async submitFieldVerification(id, { verificationDetails, status, actor, ipAddress, userAgent }, client) {
      return this.executeAction(id, 'SUBMIT_FIELD_VERIFICATION', {
        actor,
        payload: { verificationDetails, status },
        ipAddress,
        userAgent,
      }, client);
    },

    async approve(id, { remarks, _mfaToken, actor, ipAddress, userAgent }, client) {
      return this.executeAction(id, 'APPROVE', {
        actor,
        payload: { remarks, _mfaToken },
        ipAddress,
        userAgent,
      }, client);
    },

    async reject(id, { reason, _mfaToken, actor, ipAddress, userAgent }, client) {
      return this.executeAction(id, 'REJECT', {
        actor,
        payload: { reason, _mfaToken },
        ipAddress,
        userAgent,
      }, client);
    },

    async recordObjection(id, { objectionText, objectorName, actor, ipAddress, userAgent }, client) {
      return this.executeAction(id, 'RECORD_OBJECTION', {
        actor,
        payload: { objectionText, objectorName },
        ipAddress,
        userAgent,
      }, client);
    },
  };
