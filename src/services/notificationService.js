import notificationsData from '../data/notifications/notifications.json';

/**
 * Service to manage alerts and notifications
 */
export const notificationService = {
  getNotifications: async (userId = null) => {
    if (!userId) return notificationsData;
    return notificationsData.filter((n) => n.userId === userId);
  },

  getUnreadCount: async (userId) => {
    const list = await notificationService.getNotifications(userId);
    return list.filter((n) => !n.read).length;
  },
};

export default notificationService;
