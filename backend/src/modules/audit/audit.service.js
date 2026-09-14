/**
 * Land Stack — Audit Logging Service
 * 
 * Append-only audit log for all security, workflow, and data mutation events.
 * Captures actor, action, entity, before/after states, IP, user-agent, and timestamp.
 */

import { v4 as uuidv4 } from 'uuid';
import { getSupabaseAdmin, isSupabaseMode } from '../../config/supabase.js';

// In-memory store for mock mode
const MOCK_AUDIT_LOGS = [];

export const AuditService = {
  /**
   * Log an audit event
   * 
   * @param {Object} event
   * @param {string} event.entityType - e.g. 'MUTATION', 'PARCEL', 'APPLICATION', 'AUTH'
   * @param {string} event.entityId - ID/ULPIN of the target entity
   * @param {string} event.action - e.g. 'MUTATION_APPROVED', 'LOGIN_SUCCESS', 'FIELD_VERIFIED'
   * @param {Object} [event.actor] - req.user object
   * @param {string} [event.actorId] - optional fallback actor ID
   * @param {string} [event.actorType] - 'CITIZEN' | 'GOVERNMENT' | 'SYSTEM'
   * @param {string} [event.actorRole] - e.g. 'TALATHI', 'TAHSILDAR'
   * @param {string} [event.ipAddress] - client IP
   * @param {string} [event.userAgent] - client User-Agent
   * @param {Object} [event.stateBefore] - previous entity state
   * @param {Object} [event.stateAfter] - new entity state
   * @param {Object} [event.payload] - event-specific metadata (remarks, evidence, etc.)
   */
  async recordEvent(event) {
    const actor = event.actor || {};
    const actorId = event.actorId || actor.userId || actor.id || 'SYSTEM';
    const actorType = event.actorType || actor.userType || 'SYSTEM';
    const actorRole = event.actorRole || actor.role || 'SYSTEM';
    const actorContext = actor.activeContext || null;

    const record = {
      id: uuidv4(),
      entity_type: event.entityType,
      entity_id: String(event.entityId),
      action: event.action,
      actor_id: actorId,
      actor_type: actorType,
      actor_role: actorRole,
      actor_context: actorContext,
      ip_address: event.ipAddress || null,
      user_agent: event.userAgent || null,
      state_before: event.stateBefore ? JSON.stringify(event.stateBefore) : null,
      state_after: event.stateAfter ? JSON.stringify(event.stateAfter) : null,
      payload: event.payload || {},
      created_at: new Date().toISOString(),
    };

    if (!isSupabaseMode()) {
      MOCK_AUDIT_LOGS.unshift(record);
      // Keep memory bounded to last 1000 logs in mock mode
      if (MOCK_AUDIT_LOGS.length > 1000) MOCK_AUDIT_LOGS.pop();
      return record;
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      console.warn('[AuditService] Supabase admin client unavailable; writing to memory');
      MOCK_AUDIT_LOGS.unshift(record);
      return record;
    }

    try {
      const { data, error } = await admin
        .from('audit_logs')
        .insert({
          id: record.id,
          entity_type: record.entity_type,
          entity_id: record.entity_id,
          action: record.action,
          actor_id: record.actor_id,
          actor_type: record.actor_type,
          actor_role: record.actor_role,
          actor_context: record.actor_context,
          ip_address: record.ip_address,
          user_agent: record.user_agent,
          state_before: record.state_before,
          state_after: record.state_after,
          payload: record.payload,
          created_at: record.created_at,
        })
        .select()
        .single();

      if (error) {
        console.error('[AuditService] Failed to insert audit log to Supabase:', error.message);
        MOCK_AUDIT_LOGS.unshift(record);
        return record;
      }

      return data;
    } catch (err) {
      console.error('[AuditService] Unexpected error recording audit event:', err.message);
      MOCK_AUDIT_LOGS.unshift(record);
      return record;
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
    if (!isSupabaseMode()) {
      return MOCK_AUDIT_LOGS.filter(
        (log) => log.entity_type === entityType && log.entity_id === String(entityId)
      );
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return MOCK_AUDIT_LOGS.filter(
        (log) => log.entity_type === entityType && log.entity_id === String(entityId)
      );
    }

    const { data, error } = await admin
      .from('audit_logs')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', String(entityId))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AuditService] Failed to query audit logs:', error.message);
      return [];
    }

    return data || [];
  },

  /**
   * Get recent audit events (for administrative oversight)
   */
  async getRecent({ limit = 50, offset = 0, entityType = null } = {}) {
    if (!isSupabaseMode()) {
      let filtered = MOCK_AUDIT_LOGS;
      if (entityType) {
        filtered = filtered.filter((log) => log.entity_type === entityType);
      }
      return filtered.slice(offset, offset + limit);
    }

    const admin = getSupabaseAdmin();
    if (!admin) return MOCK_AUDIT_LOGS.slice(offset, offset + limit);

    let query = admin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[AuditService] Failed to query recent audit logs:', error.message);
      return [];
    }

    return data || [];
  },
};
