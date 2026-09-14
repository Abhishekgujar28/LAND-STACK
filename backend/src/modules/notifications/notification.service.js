/**
 * Land Stack — Notification Service
 * 
 * Manages dispatch and retrieval of in-app alerts and notifications
 * for citizens and officers.
 */

import { v4 as uuidv4 } from 'uuid';
import { getSupabaseAdmin, isSupabaseMode } from '../../config/supabase.js';

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    recipient_id: 'c1',
    recipient_type: 'CITIZEN',
    title: 'Mutation Request Initiated',
    message: 'Your mutation request MUT-2026-00891 has been initiated and forwarded for Talathi verification.',
    type: 'STATUS_UPDATE',
    entity_type: 'MUTATION',
    entity_id: 'MUT-2026-00891',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-2',
    recipient_id: 'off-talathi-01',
    recipient_type: 'GOVERNMENT',
    title: 'New Verification Task Assigned',
    message: 'Field verification assigned for parcel MH-PUN-HAV-004-92A in Village Wagholi.',
    type: 'TASK_ASSIGNED',
    entity_type: 'MUTATION',
    entity_id: 'MUT-2026-00891',
    is_read: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const NotificationService = {
  /**
   * Send / record a notification
   */
  async send({
    recipientId,
    recipientType = 'CITIZEN',
    title,
    message,
    type = 'SYSTEM',
    entityType = null,
    entityId = null,
  }) {
    const notif = {
      id: uuidv4(),
      recipient_id: recipientId,
      recipient_type: recipientType,
      title,
      message,
      type,
      entity_type: entityType,
      entity_id: entityId ? String(entityId) : null,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    if (!isSupabaseMode()) {
      MOCK_NOTIFICATIONS.unshift(notif);
      return notif;
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      MOCK_NOTIFICATIONS.unshift(notif);
      return notif;
    }

    try {
      const { data, error } = await admin
        .from('notifications')
        .insert(notif)
        .select()
        .single();

      if (error) {
        console.error('[NotificationService] Supabase insert error:', error.message);
        MOCK_NOTIFICATIONS.unshift(notif);
        return notif;
      }

      return data;
    } catch (err) {
      console.error('[NotificationService] Error dispatching notification:', err.message);
      MOCK_NOTIFICATIONS.unshift(notif);
      return notif;
    }
  },

  /**
   * Get notifications for a specific recipient
   */
  async getForUser(userId, { unreadOnly = false, limit = 20, offset = 0 } = {}) {
    if (!isSupabaseMode()) {
      let filtered = MOCK_NOTIFICATIONS.filter((n) => n.recipient_id === userId);
      if (unreadOnly) {
        filtered = filtered.filter((n) => !n.is_read);
      }
      return {
        items: filtered.slice(offset, offset + limit),
        total: filtered.length,
        unreadCount: MOCK_NOTIFICATIONS.filter((n) => n.recipient_id === userId && !n.is_read).length,
      };
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return { items: [], total: 0, unreadCount: 0 };
    }

    try {
      let query = admin
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, count, error } = await query;
      if (error) throw error;

      // Count unread
      const { count: unreadCount } = await admin
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .eq('is_read', false);

      return {
        items: data || [],
        total: count || 0,
        unreadCount: unreadCount || 0,
      };
    } catch (err) {
      console.error('[NotificationService] Fetch error:', err.message);
      return { items: [], total: 0, unreadCount: 0 };
    }
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId, userId) {
    if (!isSupabaseMode()) {
      const item = MOCK_NOTIFICATIONS.find(
        (n) => n.id === notificationId && n.recipient_id === userId
      );
      if (item) {
        item.is_read = true;
        item.read_at = new Date().toISOString();
      }
      return item || null;
    }

    const admin = getSupabaseAdmin();
    if (!admin) return null;

    const { data, error } = await admin
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('recipient_id', userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('[NotificationService] markAsRead error:', error.message);
      return null;
    }

    return data;
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    if (!isSupabaseMode()) {
      MOCK_NOTIFICATIONS.forEach((n) => {
        if (n.recipient_id === userId) {
          n.is_read = true;
          n.read_at = new Date().toISOString();
        }
      });
      return { success: true };
    }

    const admin = getSupabaseAdmin();
    if (!admin) return { success: true };

    const { error } = await admin
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('[NotificationService] markAllAsRead error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  },
};
