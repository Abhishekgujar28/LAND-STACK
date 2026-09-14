/**
 * Land Stack — Notification Service
 * 
 * Manages dispatch and retrieval of in-app alerts and notifications
 * for citizens and officers strictly in Supabase PostgreSQL.
 */

import { v4 as uuidv4 } from 'uuid';
import { getSupabaseAdmin } from '../../config/supabase.js';

export const NotificationService = {
  /**
   * Send / record a notification in PostgreSQL
   */
  async send({
    recipientId,
    userId,
    title,
    message,
    type = 'INFO',
    actionLink = null,
  }) {
    const targetUserId = recipientId || userId || 'SYSTEM';
    const notifId = `NOTIF-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const notif = {
      id: notifId,
      user_id: targetUserId,
      title,
      message,
      type: type || 'INFO',
      is_read: false,
      action_link: actionLink,
      created_at: now,
    };

    const admin = getSupabaseAdmin();
    if (!admin) {
      console.warn('[NotificationService] Supabase admin client unavailable');
      return notif;
    }

    try {
      const { data, error } = await admin
        .from('notifications')
        .insert(notif)
        .select()
        .maybeSingle();

      if (error) {
        console.error('[NotificationService] Supabase insert error:', error.message);
        return notif;
      }

      return data || notif;
    } catch (err) {
      console.error('[NotificationService] Error dispatching notification:', err.message);
      return notif;
    }
  },

  // Alias for compatibility
  async sendNotification(params) {
    return this.send(params);
  },

  /**
   * Get notifications for a specific recipient
   */
  async getForUser(userId, { unreadOnly = false, limit = 20, offset = 0 } = {}) {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return { items: [], total: 0, unreadCount: 0 };
    }

    try {
      let query = admin
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false, nullsFirst: false })
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
        .eq('user_id', userId)
        .eq('is_read', false);

      return {
        items: (data || []).map((n) => ({
          ...n,
          recipient_id: n.user_id,
          recipientId: n.user_id,
        })),
        total: count || 0,
        unreadCount: unreadCount || 0,
      };
    } catch (err) {
      console.error('[NotificationService] Error querying notifications:', err.message);
      return { items: [], total: 0, unreadCount: 0 };
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    const admin = getSupabaseAdmin();
    if (!admin) return { success: false };

    let query = admin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { error } = await query;
    if (error) {
      console.error('[NotificationService] Error marking as read:', error.message);
      return { success: false };
    }

    return { success: true };
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    const admin = getSupabaseAdmin();
    if (!admin) return { count: 0 };

    const { data, error } = await admin
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .select('id');

    if (error) {
      console.error('[NotificationService] Error marking all as read:', error.message);
      return { count: 0 };
    }

    return { count: data?.length || 0 };
  },
};
