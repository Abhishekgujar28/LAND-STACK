/**
 * Land Stack — Citizen Applications Service
 * 
 * Manages citizen statutory service requests (e.g. 7/12 extract, 8A, Mojani, etc.)
 * Strictly Database-Backed (Supabase PostgreSQL)
 */

import { Errors } from '../../core/errors.js';
import { UserTypes } from '../../core/permissions.js';
import { getSupabaseAdmin, getSupabaseAnon } from '../../config/supabase.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationService } from '../notifications/notification.service.js';

export const ApplicationService = {
  /**
   * Get available application types / statutory services
   */
  async getApplicationTypes(client) {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database connection unavailable');

    const { data, error } = await db
      .from('application_types')
      .select('*')
      .order('title');

    if (error) {
      console.error('[ApplicationService] Error fetching application types:', error.message);
      throw Errors.internal('Failed to retrieve application types: ' + error.message);
    }

    return data || [];
  },

  /**
   * Submit a new citizen application
   */
  async createApplication(payload, actor, client) {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database connection unavailable');

    if (!actor || !actor.userId) {
      throw Errors.unauthenticated('Actor missing or invalid');
    }

    const citizenId = actor.userId;
    const citizenName = actor.name || 'Citizen Applicant';
    const parcelUlpin = payload.parcelUlpin || payload.parcelId || null;

    // Validate type
    const types = await this.getApplicationTypes(client);
    const appType = types.find(
      (t) => t.code === payload.typeCode || t.title === payload.typeCode
    );

    const typeCode = appType?.code || payload.typeCode;
    const feeAmount = payload.feeAmount ?? appType?.fee ?? 0;
    const appId = `APP-${Date.now().toString().slice(-6)}`;
    const appNumber = `APP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const trackingHistory = [
      {
        step: 1,
        title: 'Application Submitted',
        description: `Application received for ${appType?.title || typeCode}`,
        date: now,
        status: 'COMPLETED',
        actor: citizenName,
      },
    ];

    const { data, error } = await db
      .from('applications')
      .insert({
        id: appId,
        application_number: appNumber,
        type_code: typeCode,
        citizen_id: citizenId,
        parcel_ulpin: parcelUlpin,
        status: 'SUBMITTED',
        submission_date: now,
        fee_amount: feeAmount,
        payment_status: feeAmount > 0 ? 'PAID' : 'EXEMPT',
        tracking_history: trackingHistory,
        form_data: payload.formData || {},
      })
      .select('*, application_types(*)')
      .single();

    if (error) {
      console.error('[ApplicationService] Insert error:', error.message, error.details, error.hint);
      throw Errors.internal('Failed to persist application in database: ' + error.message);
    }

    // Audit log
    await AuditService.recordEvent({
      entityType: 'APPLICATION',
      entityId: appId,
      action: 'APPLICATION_SUBMITTED',
      actor,
      stateAfter: { status: 'SUBMITTED' },
      payload: { appNumber, typeCode, parcelUlpin },
    });

    // Notification
    await NotificationService.send({
      recipientId: citizenId,
      recipientType: 'CITIZEN',
      title: 'Application Received',
      message: `Your application ${appNumber} for ${appType?.title || typeCode} has been submitted.`,
      type: 'APPLICATION_UPDATE',
      entityType: 'APPLICATION',
      entityId: appId,
    });

    return data;
  },

  /**
   * Get applications with filtering
   */
  async getApplications({ citizenId, status, typeCode, page = 1, limit = 20 } = {}, actor, client) {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database connection unavailable');

    let query = db
      .from('applications')
      .select('*, application_types(*)', { count: 'exact' });

    if (actor?.userType === UserTypes.CITIZEN) {
      query = query.eq('citizen_id', actor.userId);
    } else if (citizenId) {
      query = query.eq('citizen_id', citizenId);
    }

    if (status) query = query.eq('status', status);
    if (typeCode) query = query.eq('type_code', typeCode);

    const offset = (page - 1) * limit;
    const { data, count, error } = await query
      .order('submission_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[ApplicationService] Query error:', error.message);
      throw Errors.internal('Failed to fetch applications: ' + error.message);
    }

    return {
      items: data || [],
      total: count || 0,
      page,
      limit,
    };
  },

  /**
   * Get single application by ID
   */
  async getApplicationById(id, actor, client) {
    if (!id) throw Errors.badRequest('Application ID is required');
    const cleanId = id.trim();

    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database connection unavailable');

    const { data, error } = await db
      .from('applications')
      .select('*, application_types(*)')
      .or(`id.eq.${cleanId},application_number.eq.${cleanId}`)
      .maybeSingle();

    if (error) {
      console.error('[ApplicationService] Error fetching application:', error.message);
      throw Errors.internal('Failed to load application: ' + error.message);
    }

    if (!data) {
      throw Errors.notFound(`Application '${cleanId}' not found`);
    }

    // Access control: citizen can only view their own
    if (actor?.userType === UserTypes.CITIZEN) {
      if (data.citizen_id && data.citizen_id !== actor.userId) {
        throw Errors.forbidden('Access denied to this application');
      }
    }

    return data;
  },

  /**
   * Update application status (Officer action)
   */
  async updateStatus(id, { status, remarks, rejectionReason }, actor, client) {
    const app = await this.getApplicationById(id, actor, client);
    const oldStatus = app.status;
    const now = new Date().toISOString();

    const historyStep = {
      step: (app.tracking_history?.length || 1) + 1,
      title: `Status: ${status}`,
      description: remarks || rejectionReason || `Application moved to ${status}`,
      date: now,
      status: status === 'REJECTED' ? 'REJECTED' : 'COMPLETED',
      actor: `${actor?.role || 'OFFICER'} (${actor?.name || 'Officer'})`,
    };

    const newHistory = [...(app.tracking_history || []), historyStep];

    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database connection unavailable');

    const { data, error } = await db
      .from('applications')
      .update({
        status,
        tracking_history: newHistory,
        updated_at: now,
      })
      .eq('id', app.id)
      .select('*, application_types(*)')
      .single();

    if (error) {
      console.error('[ApplicationService] Failed to update application status:', error.message);
      throw Errors.internal('Failed to update application status: ' + error.message);
    }

    // Audit event
    await AuditService.recordEvent({
      entityType: 'APPLICATION',
      entityId: app.id,
      action: `APPLICATION_STATUS_${status}`,
      actor,
      stateBefore: { status: oldStatus },
      stateAfter: { status },
      payload: { remarks, rejectionReason },
    });

    // Notification to applicant
    if (app.citizen_id) {
      await NotificationService.send({
        recipientId: app.citizen_id,
        recipientType: 'CITIZEN',
        title: `Application ${status}`,
        message: `Your application ${app.application_number} has been updated to ${status}.`,
        type: 'APPLICATION_UPDATE',
        entityType: 'APPLICATION',
        entityId: app.id,
      });
    }

    return {
      id: app.id,
      previousStatus: oldStatus,
      currentStatus: status,
      updatedAt: now,
      application: data,
    };
  },
};
