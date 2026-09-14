/**
 * Land Stack — Mutation Service
 * 
 * Implements the 12-state mutation workflow with state machine validation,
 * permission enforcement, audit recording, and notification dispatch.
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
import { getSupabaseAdmin, isSupabaseMode } from '../../config/supabase.js';
import { mockStore } from '../../data/mockStore.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationService } from '../notifications/notification.service.js';

// In-memory collections for objects created during mock mode
const MOCK_OBJECTIONS = [];
const MOCK_HEARINGS = [];

export const MutationService = {
  /**
   * Create a new mutation application
   */
  async createMutation({ parcelUlpin, type, buyerName, sellerName, remarks, formData }, actor) {
    // 1. Verify parcel exists
    let parcel = null;
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { data } = await admin
          .from('parcels')
          .select('id, ulpin, village_code, tehsil_code, district_code, state_code, current_owner')
          .eq('ulpin', parcelUlpin)
          .maybeSingle();
        parcel = data;
      }
    } else {
      parcel = (mockStore.parcels || []).find(
        (p) => (p.ulpin || p.id || '').toUpperCase() === parcelUlpin.toUpperCase()
      );
    }

    if (!parcel) {
      throw Errors.notFound(`Parcel with ULPIN '${parcelUlpin}' not found`);
    }

    const mutationId = `MUT-${Date.now().toString().slice(-6)}`;
    const mutationNumber = `FERFAR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const initialState = MutationStates.INITIATED;
    const now = new Date().toISOString();

    const newRecord = {
      id: mutationId,
      mutation_number: mutationNumber,
      mutationNumber,
      parcel_ulpin: parcelUlpin,
      parcelId: parcelUlpin,
      type: type || 'Sale Deed Mutation',
      mutationType: type || 'Sale Deed Mutation',
      status: initialState,
      applicant_id: actor?.userId || 'GUEST',
      applicantId: actor?.userId || 'GUEST',
      applicant_name: actor?.name || buyerName || 'Citizen Applicant',
      buyer_name: buyerName || actor?.name || '',
      seller_name: sellerName || parcel.current_owner || '',
      remarks: remarks || 'Mutation request submitted',
      form_data: formData || {},
      village_code: parcel.village_code || parcel.villageCode || null,
      tehsil_code: parcel.tehsil_code || parcel.tehsilCode || null,
      district_code: parcel.district_code || parcel.districtCode || null,
      state_code: parcel.state_code || parcel.stateCode || 'MH',
      created_at: now,
      updated_at: now,
      filing_date: now.split('T')[0],
      sla_days: 30,
      sla_deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    };

    // 2. Persist mutation
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { error } = await admin.from('mutations').insert({
          id: newRecord.id,
          mutation_number: newRecord.mutation_number,
          parcel_ulpin: newRecord.parcel_ulpin,
          type: newRecord.type,
          status: newRecord.status,
          applicant_id: newRecord.applicant_id,
          applicant_name: newRecord.applicant_name,
          buyer_name: newRecord.buyer_name,
          seller_name: newRecord.seller_name,
          remarks: newRecord.remarks,
          village_code: newRecord.village_code,
          tehsil_code: newRecord.tehsil_code,
          district_code: newRecord.district_code,
          state_code: newRecord.state_code,
          sla_days: newRecord.sla_days,
          sla_deadline: newRecord.sla_deadline,
        });

        if (error) {
          console.error('[MutationService] Failed to insert mutation to Supabase:', error.message);
          throw Errors.internal('Database failed to create mutation record');
        }
      }
    } else {
      if (mockStore.mutations) {
        mockStore.mutations.unshift(newRecord);
      }
    }

    // 3. Initial timeline entry
    const initialStep = {
      title: 'Mutation Request Initiated',
      date: now.split('T')[0],
      description: `Mutation filed for parcel ${parcelUlpin} by ${newRecord.applicant_name}.`,
      actor: actor?.name || 'Citizen Portal',
      status: 'COMPLETED',
      state: initialState,
    };

    if (mockStore.mutationTimeline) {
      mockStore.mutationTimeline.unshift({
        mutationId: newRecord.id,
        steps: [initialStep],
      });
    }

    // 4. Audit event
    await AuditService.recordEvent({
      entityType: 'MUTATION',
      entityId: newRecord.id,
      action: 'MUTATION_INITIATED',
      actor,
      stateAfter: { status: initialState },
      payload: { parcelUlpin, mutationNumber, type },
    });

    // 5. Notification
    await NotificationService.send({
      recipientId: actor?.userId || 'c1',
      recipientType: actor?.userType || 'CITIZEN',
      title: 'Mutation Initiated',
      message: `Your mutation application ${mutationNumber} for parcel ${parcelUlpin} has been registered.`,
      type: 'STATUS_UPDATE',
      entityType: 'MUTATION',
      entityId: newRecord.id,
    });

    return newRecord;
  },

  /**
   * Get list of mutations with role/jurisdiction-aware filtering
   */
  async getMutations({ parcelUlpin, tehsilCode, villageCode, status, applicantId, page = 1, limit = 20 }, actor) {
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        let query = admin
          .from('mutations')
          .select('*, mutation_timeline(*)', { count: 'exact' });

        if (parcelUlpin) query = query.ilike('parcel_ulpin', parcelUlpin);
        if (tehsilCode) query = query.eq('tehsil_code', tehsilCode);
        if (villageCode) query = query.eq('village_code', villageCode);
        if (status) query = query.eq('status', status);

        // Citizen only sees their own applications
        if (actor?.userType === UserTypes.CITIZEN) {
          query = query.eq('applicant_id', actor.userId);
        } else if (applicantId) {
          query = query.eq('applicant_id', applicantId);
        }

        // Officer jurisdiction filtering
        if (actor?.userType === UserTypes.GOVERNMENT) {
          if (actor.role === Roles.TALATHI && actor.jurisdiction?.villageCode) {
            query = query.eq('village_code', actor.jurisdiction.villageCode);
          } else if (actor.role === Roles.TAHSILDAR && actor.jurisdiction?.tehsilCode) {
            query = query.eq('tehsil_code', actor.jurisdiction.tehsilCode);
          }
        }

        const offset = (page - 1) * limit;
        const { data, count, error } = await query
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          console.error('[MutationService] Supabase getMutations error:', error.message);
          throw Errors.internal('Failed to fetch mutations');
        }

        return {
          items: data || [],
          total: count || 0,
          page,
          limit,
        };
      }
    }

    // Mock store mode
    let list = mockStore.mutations || [];

    if (parcelUlpin) {
      const ulpinLower = parcelUlpin.toLowerCase();
      list = list.filter((m) => (m.parcelId || m.parcel_ulpin || m.parcelUlpin || '').toLowerCase() === ulpinLower);
    }
    if (tehsilCode) {
      list = list.filter((m) => (m.tehsil_code || m.tehsilCode) === tehsilCode);
    }
    if (villageCode) {
      list = list.filter((m) => (m.village_code || m.villageCode) === villageCode);
    }
    if (status) {
      list = list.filter((m) => (m.status || '').toUpperCase() === status.toUpperCase());
    }

    if (actor?.userType === UserTypes.CITIZEN) {
      list = list.filter((m) => {
        const appId = m.applicant_id || m.applicantId || '';
        const initBy = m.initiatedBy || '';
        return appId === actor.userId || initBy.includes(actor.userId) || initBy.includes(actor.name);
      });
    } else if (applicantId) {
      list = list.filter((m) => (m.applicant_id || m.applicantId) === applicantId);
    }

    const offset = (page - 1) * limit;
    const paginated = list.slice(offset, offset + limit);

    return {
      items: paginated,
      total: list.length,
      page,
      limit,
    };
  },

  /**
   * Get single mutation by ID or mutation number
   */
  async getMutationById(id, actor) {
    if (!id) throw Errors.badRequest('Mutation ID is required');
    const cleanId = id.trim();

    let mutation = null;
    let timeline = [];

    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { data } = await admin
          .from('mutations')
          .select('*, mutation_timeline(*)')
          .or(`id.eq.${cleanId},mutation_number.eq.${cleanId}`)
          .maybeSingle();

        if (data) {
          mutation = data;
          timeline = data.mutation_timeline || [];
        }
      }
    }

    if (!mutation) {
      mutation = (mockStore.mutations || []).find(
        (m) => m.id === cleanId || m.mutationNumber === cleanId || m.mutation_number === cleanId
      );
      if (mutation) {
        const timelineRec = (mockStore.mutationTimeline || []).find(
          (t) => t.mutationId === mutation.id
        );
        timeline = timelineRec ? timelineRec.steps : [];
      }
    }

    if (!mutation) {
      throw Errors.notFound(`Mutation '${cleanId}' not found`);
    }

    // Fetch related objections and hearings
    const objections = MOCK_OBJECTIONS.filter((o) => o.mutationId === mutation.id);
    const hearings = MOCK_HEARINGS.filter((h) => h.mutationId === mutation.id);

    // Fetch audit trail
    const auditTrail = await AuditService.getTrail('MUTATION', mutation.id);

    return {
      ...mutation,
      timeline,
      objections,
      hearings,
      auditTrail,
    };
  },

  /**
   * Execute state machine action transition
   */
  async executeAction(mutationId, actionName, { actor, payload = {}, ipAddress, userAgent }) {
    const mutation = await this.getMutationById(mutationId, actor);
    const currentState = mutation.status;

    // 1. Validate action is known and valid in current state
    const actionValidation = validateAction(actionName, currentState);
    if (!actionValidation.valid) {
      throw Errors.conflict(actionValidation.reason);
    }
    const actionDef = actionValidation.action;

    // 2. Validate actor has required permission
    if (actionDef.permission) {
      // Note: Admin explicitly cannot approve mutations (Section 12 / permissions.js)
      if (!hasPermission(actor?.role, actionDef.permission)) {
        throw Errors.forbidden(
          `Actor with role '${actor?.role}' does not have permission '${actionDef.permission}' to perform '${actionName}'.`
        );
      }
    }

    // 3. MFA Step-up check if required
    if (actionDef.requiresMfa) {
      const mfaToken = payload._mfaToken || payload.mfaToken;
      // In production, mfaToken is verified. In mock mode, we require presence if not bypassed
      if (!mfaToken && !actor?.mfaVerified) {
        throw Errors.mfaRequired(`Statutory action '${actionName}' requires MFA step-up verification.`);
      }
    }

    // 4. Jurisdiction check for officers
    if (actor?.userType === UserTypes.GOVERNMENT) {
      const officerVillage = actor.jurisdiction?.villageCode;
      const officerTehsil = actor.jurisdiction?.tehsilCode;
      const mutVillage = mutation.village_code || mutation.villageCode;
      const mutTehsil = mutation.tehsil_code || mutation.tehsilCode;

      if (actor.role === Roles.TALATHI && officerVillage && mutVillage && officerVillage !== mutVillage) {
        throw Errors.forbidden(`Talathi jurisdiction (${officerVillage}) does not cover mutation village (${mutVillage}).`);
      }
      if (actor.role === Roles.TAHSILDAR && officerTehsil && mutTehsil && officerTehsil !== mutTehsil) {
        throw Errors.forbidden(`Tahsildar jurisdiction (${officerTehsil}) does not cover mutation tehsil (${mutTehsil}).`);
      }
    }

    const nextState = actionDef.to;
    const now = new Date().toISOString();

    // 5. Update mutation state
    mutation.status = nextState;
    mutation.updated_at = now;
    if (payload.remarks) mutation.remarks = payload.remarks;

    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        const updateData = {
          status: nextState,
          updated_at: now,
        };
        if (actionName === 'APPROVE') {
          updateData.sanction_date = now.split('T')[0];
          updateData.sanctioned_by = `${actor.role} (${actor.name})`;
        }
        await admin.from('mutations').update(updateData).eq('id', mutation.id);
      }
    } else {
      const existingInMock = (mockStore.mutations || []).find((m) => m.id === mutation.id);
      if (existingInMock) {
        existingInMock.status = nextState;
        if (actionName === 'APPROVE') {
          existingInMock.sanctionDate = now.split('T')[0];
          existingInMock.sanctionedBy = `${actor?.role || 'OFFICER'} (${actor?.name || 'Officer'})`;
        }
      }
    }

    // 6. Handle action-specific side effects
    if (actionName === 'RECORD_OBJECTION') {
      const objectionRecord = {
        id: uuidv4(),
        mutationId: mutation.id,
        objectorName: payload.objectorName || actor?.name || 'Third Party',
        objectionType: payload.objectionType || 'Title Dispute',
        description: payload.description || payload.remarks || '',
        evidenceDocIds: payload.evidenceDocIds || [],
        recordedAt: now,
      };
      MOCK_OBJECTIONS.push(objectionRecord);
    } else if (actionName === 'SCHEDULE_HEARING') {
      const hearingRecord = {
        id: uuidv4(),
        mutationId: mutation.id,
        scheduledDate: payload.scheduledDate,
        venue: payload.venue || 'Tehsildar Court Room No. 2',
        notes: payload.notes || payload.remarks || '',
        status: 'SCHEDULED',
        scheduledBy: actor?.name,
        createdAt: now,
      };
      MOCK_HEARINGS.push(hearingRecord);
    }

    // 7. Timeline entry
    const stepDescription =
      payload.remarks ||
      payload.description ||
      payload.reason ||
      `Transitioned to ${nextState} via action ${actionName}`;

    const timelineStep = {
      title: `${actionName.replace(/_/g, ' ')}`,
      date: now.split('T')[0],
      description: stepDescription,
      actor: `${actor?.role || 'OFFICER'} (${actor?.name || 'Officer'})`,
      status: 'COMPLETED',
      state: nextState,
    };

    const timelineRec = (mockStore.mutationTimeline || []).find((t) => t.mutationId === mutation.id);
    if (timelineRec) {
      timelineRec.steps.push(timelineStep);
    } else if (mockStore.mutationTimeline) {
      mockStore.mutationTimeline.push({
        mutationId: mutation.id,
        steps: [timelineStep],
      });
    }

    // 8. Record audit event
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

    // 9. Dispatch notification
    const recipientId = mutation.applicant_id || mutation.applicantId || 'c1';
    await NotificationService.send({
      recipientId,
      recipientType: 'CITIZEN',
      title: `Mutation Updated: ${nextState}`,
      message: `Your mutation ${mutation.mutation_number || mutation.mutationNumber} status changed to ${nextState}.`,
      type: 'STATUS_UPDATE',
      entityType: 'MUTATION',
      entityId: mutation.id,
    });

    return {
      success: true,
      mutationId: mutation.id,
      previousState: currentState,
      currentState: nextState,
      action: actionName,
      timestamp: now,
    };
  },

  /**
   * Action: Approve mutation (requires mutation.approve & MFA)
   */
  async approve(mutationId, { remarks, _mfaToken, actor, ipAddress, userAgent }) {
    return this.executeAction(mutationId, 'APPROVE', {
      actor,
      payload: { remarks, _mfaToken },
      ipAddress,
      userAgent,
    });
  },

  /**
   * Action: Reject mutation (requires mutation.reject & MFA)
   */
  async reject(mutationId, { reason, _mfaToken, actor, ipAddress, userAgent }) {
    return this.executeAction(mutationId, 'REJECT', {
      actor,
      payload: { reason, remarks: reason, _mfaToken },
      ipAddress,
      userAgent,
    });
  },

  /**
   * Action: Record objection during notice period
   */
  async recordObjection(mutationId, { objectorName, objectionType, description, evidenceDocIds, actor, ipAddress, userAgent }) {
    return this.executeAction(mutationId, 'RECORD_OBJECTION', {
      actor,
      payload: { objectorName, objectionType, description, evidenceDocIds },
      ipAddress,
      userAgent,
    });
  },

  /**
   * Action: Schedule dispute hearing
   */
  async scheduleHearing(mutationId, { scheduledDate, venue, notes, actor, ipAddress, userAgent }) {
    return this.executeAction(mutationId, 'SCHEDULE_HEARING', {
      actor,
      payload: { scheduledDate, venue, notes },
      ipAddress,
      userAgent,
    });
  },

  /**
   * Action: Submit field verification report (Talathi)
   */
  async submitFieldVerification(mutationId, { remarks, boundaryChecked, photos, actor, ipAddress, userAgent }) {
    return this.executeAction(mutationId, 'SUBMIT_FIELD_VERIFY', {
      actor,
      payload: { remarks, boundaryChecked, photos },
      ipAddress,
      userAgent,
    });
  },
};
