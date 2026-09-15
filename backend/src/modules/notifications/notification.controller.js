/**
 * Land Stack — Notification Controller
 */

import { NotificationService } from './notification.service.js';
import { sendSuccess } from '../../core/response.js';
import { Errors } from '../../core/errors.js';

export const NotificationController = {
  async getMyNotifications(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw Errors.unauthorized('User not authenticated');

      const unreadOnly = req.query.unreadOnly === 'true';
      const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
      const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

      const result = await NotificationService.getForUser(userId, {
        unreadOnly,
        limit,
        offset,
      }, req.supabase);

      return sendSuccess(res, result, 'Notifications retrieved');
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      const updated = await NotificationService.markAsRead(id, userId, req.supabase);
      if (!updated) throw Errors.notFound('Notification not found or access denied');

      return sendSuccess(res, updated, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  },

  async markAllAsRead(req, res, next) {
    try {
      const userId = req.user?.userId;
      const result = await NotificationService.markAllAsRead(userId, req.supabase);

      return sendSuccess(res, result, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  },
};
