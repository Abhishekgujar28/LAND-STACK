/**
 * Land Stack — Citizen Applications Service
 * 
 * Manages citizen statutory service requests (e.g. 7/12 extract, 8A, Mojani, etc.)
 */

import { v4 as uuidv4 } from 'uuid';
import { Errors } from '../../core/errors.js';
import { UserTypes } from '../../core/permissions.js';
import { getSupabaseAdmin, isSupabaseMode } from '../../config/supabase.js';
import { mockStore } from '../../data/mockStore.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationService } from '../notifications/notification.service.js';

export const ApplicationService = {
  /**
   * Get available application types / statutory services
   */
  async getApplicationTypes() {
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { data, error } = await admin
          .from('application_types')
          .select('*')
          .order('name');
        if (!error && data) return data;
      }
    }
    return mockStore.applicationTypes || [];
  },

  /**
   * Submit a new citizen application
   */
  async createApplication(payload, actor) {
    const citizenId = actor?.userId || 'GUEST';
    const citizenName = actor?.name || 'Citizen Applicant';
    const parcelUlpin = payload.parcelUlpin || payload.parcelId || null;

    // Validate type
    const types = await this.getApplicationTypes();
    const appType = types.find(
      (t) => (t.type || t.code || t.id) === payload.typeCode || t.name === payload.typeCode
    );

    const feeAmount = payload.feeAmount ?? appType?.fee ?? 0;
    const slaDays = appType?.slaDays || 15;
    const appId = `APP-${Date.now().toString().slice(-6)}`;
    const appNumber = `APP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const newApp = {
      id: appId,
      applicationNumber: appNumber,
      application_number: appNumber,
      typeCode: payload.typeCode,
      type_code: payload.typeCode,
      typeName: appType?.name || payload.typeCode,
      citizenId,
      citizen_id: citizenId,
      citizenName,
      parcelId: parcelUlpin,
      parcel_ulpin: parcelUlpin,
      status: 'SUBMITTED',
      submissionDate: now,
      feeAmount,
      fee_amount: feeAmount,
      paymentStatus: feeAmount > 0 ? 'PAID' : 'EXEMPT',
      formData: payload.formData || {},
      form_data: payload.formData || {},
      documents: payload.documents || [],
      slaDays,
      slaDeadline: new Date(Date.now() + slaDays * 86400000).toISOString().split('T')[0],
      trackingHistory: [
        {
          step: 1,
          title: 'Application Submitted',
          description: `Application received for ${appType?.name || payload.typeCode}`,
          date: now,
          status: 'COMPLETED',
          actor: citizenName,
        },
      ],
    };

    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { error } = await admin.from('applications').insert({
          id: newApp.id,
          application_number: newApp.application_number,
          type_code: newApp.type_code,
          citizen_id: newApp.citizen_id,
          parcel_ulpin: newApp.parcel_ulpin,
          status: newApp.status,
          submission_date: newApp.submissionDate,
          fee_amount: newApp.fee_amount,
          payment_status: newApp.paymentStatus,
          form_data: newApp.form_data,
          sla_days: newApp.slaDays,
          sla_deadline: newApp.slaDeadline,
        });

        if (error) {
          console.error('[ApplicationService] Insert error:', error.message);
          throw Errors.internal('Failed to persist application in database');
        }
      }
    } else {
      if (mockStore.applications) {
        mockStore.applications.unshift(newApp);
      }
    }

    // Audit log
    await AuditService.recordEvent({
      entityType: 'APPLICATION',
      entityId: newApp.id,
      action: 'APPLICATION_SUBMITTED',
      actor,
      stateAfter: { status: 'SUBMITTED' },
      payload: { appNumber, typeCode: payload.typeCode, parcelUlpin },
    });

    // Notification
    await NotificationService.send({
      recipientId: citizenId,
      recipientType: 'CITIZEN',
      title: 'Application Received',
      message: `Your application ${appNumber} for ${appType?.name || payload.typeCode} has been submitted.`,
      type: 'APPLICATION_UPDATE',
      entityType: 'APPLICATION',
      entityId: newApp.id,
    });

    return newApp;
  },

  /**
   * Get applications with filtering
   */
  async getApplications({ citizenId, status, typeCode, page = 1, limit = 20 } = {}, actor) {
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        let query = admin
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
          throw Errors.internal('Failed to fetch applications');
        }

        return {
          items: data || [],
          total: count || 0,
          page,
          limit,
        };
      }
    }

    let list = mockStore.applications || [];

    if (actor?.userType === UserTypes.CITIZEN) {
      list = list.filter((a) => (a.citizenId || a.citizen_id) === actor.userId);
    } else if (citizenId) {
      list = list.filter((a) => (a.citizenId || a.citizen_id) === citizenId);
    }

    if (status) {
      list = list.filter((a) => (a.status || '').toUpperCase() === status.toUpperCase());
    }

    if (typeCode) {
      list = list.filter((a) => (a.typeCode || a.type_code) === typeCode);
    }

    const offset = (page - 1) * limit;
    return {
      items: list.slice(offset, offset + limit),
      total: list.length,
      page,
      limit,
    };
  },

  /**
   * Get single application by ID
   */
  async getApplicationById(id, actor) {
    if (!id) throw Errors.badRequest('Application ID is required');
    const cleanId = id.trim();

    let app = null;

    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { data } = await admin
          .from('applications')
          .select('*, application_types(*)')
          .or(`id.eq.${cleanId},application_number.eq.${cleanId}`)
          .maybeSingle();
        app = data;
      }
    }

    if (!app) {
      app = (mockStore.applications || []).find(
        (a) => a.id === cleanId || a.applicationNumber === cleanId || a.application_number === cleanId
      );
    }

    if (!app) {
      throw Errors.notFound(`Application '${cleanId}' not found`);
    }

    // Access control: citizen can only view their own
    if (actor?.userType === UserTypes.CITIZEN) {
      const appCitizenId = app.citizen_id || app.citizenId;
      if (appCitizenId && appCitizenId !== actor.userId) {
        throw Errors.forbidden('Access denied to this application');
      }
    }

    return app;
  },

  /**
   * Update application status (Officer action)
   */
  async updateStatus(id, { status, remarks, rejectionReason }, actor) {
    const app = await this.getApplicationById(id, actor);
    const oldStatus = app.status;
    const now = new Date().toISOString();

    const historyStep = {
      step: (app.trackingHistory?.length || 1) + 1,
      title: `Status: ${status}`,
      description: remarks || rejectionReason || `Application moved to ${status}`,
      date: now,
      status: status === 'REJECTED' ? 'REJECTED' : 'COMPLETED',
      actor: `${actor?.role || 'OFFICER'} (${actor?.name || 'Officer'})`,
    };

    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        await admin
          .from('applications')
          .update({
            status,
            remarks: remarks || rejectionReason,
            updated_at: now,
          })
          .eq('id', app.id);
      }
    } else {
      const item = (mockStore.applications || []).find((a) => a.id === app.id);
      if (item) {
        item.status = status;
        if (!item.trackingHistory) item.trackingHistory = [];
        item.trackingHistory.push(historyStep);
      }
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
    const citizenId = app.citizen_id || app.citizenId;
    if (citizenId) {
      await NotificationService.send({
        recipientId: citizenId,
        recipientType: 'CITIZEN',
        title: `Application ${status}`,
        message: `Your application ${app.application_number || app.applicationNumber} has been updated to ${status}.`,
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
    };
  },
};
