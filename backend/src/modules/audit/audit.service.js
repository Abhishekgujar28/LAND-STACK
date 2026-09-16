/**
 * Land Stack — Audit Logging Service
 * 
 * Append-only audit log for all security, workflow, and data mutation events.
 * Captures actor, action, entity, before/after states, IP, user-agent, and timestamp.
 */

import { getSupabaseAdmin } from '../../config/supabase.js';
import { Errors } from '../../core/errors.js';

export const AuditService = {
  /**
   * Log an audit event to PostgreSQL audit_events table
   */
  async recordEvent(event) {
    const actor = event.actor || {};
    const actorId = event.actorId || actor.userId || actor.id || 'SYSTEM';
    const actorRole = event.actorRole || actor.role || 'SYSTEM';
    const resourceType = event.entityType || event.resourceType || 'SYSTEM';
    const resourceId = String(event.entityId || event.resourceId || '0');

    const admin = getSupabaseAdmin();
    if (!admin) {
      console.warn('[AuditService] Supabase admin client unavailable');
      return null;
    }

    try {
      const payload = {
        ...(event.payload || {}),
        stateBefore: event.stateBefore || null,
        stateAfter: event.stateAfter || null,
      };

      const { data, error } = await admin
        .from('audit_events')
        .insert({
          actor_id: actorId,
          actor_role: actorRole,
          action: event.action,
          resource_type: resourceType,
          resource_id: resourceId,
          payload,
          ip_address: event.ipAddress || null,
          user_agent: event.userAgent || null,
          created_at: new Date().toISOString(),
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('[AuditService] Failed to insert audit event:', error.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error('[AuditService] Unexpected error recording audit event:', err.message);
      return null;
    }
  },

  /**
   * Helper: extract audit context directly from express req
   */
  async logFromRequest(req, { entityType, entityId, action, stateBefore, stateAfter, payload }) {
    return this.recordEvent({
      entityType,
      entityId,
      action,
      actor: req.user,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'],
      stateBefore,
      stateAfter,
      payload,
    });
  },

  /**
   * Retrieve audit trail for a specific entity
   */
  async getTrail(entityType, entityId) {
    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Database connection unavailable');

    const { data, error } = await admin
      .from('audit_events')
      .select('*')
      .eq('resource_type', entityType)
      .eq('resource_id', String(entityId))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AuditService] Failed to query audit trail:', error.message);
      throw Errors.internal(`Database error querying audit trail: ${error.message}`);
    }

    return (data || []).map((row) => ({
      ...row,
      entity_type: row.resource_type,
      entity_id: row.resource_id,
      state_before: row.payload?.stateBefore,
      state_after: row.payload?.stateAfter,
    }));
  },

  /**
   * Get recent audit events (for administrative oversight)
   */
  async getRecent({ limit = 50, offset = 0, entityType = null } = {}) {
    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Database connection unavailable');

    let query = admin
      .from('audit_events')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (entityType) {
      query = query.eq('resource_type', entityType);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[AuditService] Failed to query recent audit events:', error.message);
      throw Errors.internal(`Database error querying recent audit events: ${error.message}`);
    }

    return (data || []).map((row) => ({
      ...row,
      entity_type: row.resource_type,
      entity_id: row.resource_id,
      state_before: row.payload?.stateBefore,
      state_after: row.payload?.stateAfter,
    }));
  },
};
