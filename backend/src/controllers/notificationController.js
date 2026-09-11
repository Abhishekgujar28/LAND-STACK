import { notificationService } from '../services/notificationService.js';

export const notificationController = {
  getNotifications: async (req, res, next) => {
    try {
      const { userId } = req.query;
      const list = await notificationService.getNotifications(userId);
      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      next(err);
    }
  },

  markAsRead: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await notificationService.markAsRead(id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
