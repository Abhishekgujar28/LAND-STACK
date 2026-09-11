import apiClient from '../api/client';

/**
 * Service to manage alerts and notifications via backend REST API
 */
export const notificationService = {
  getNotifications: async (userId = null) => {
    return apiClient.get('notifications', { userId });
  },

  getUnreadCount: async (userId) => {
    const list = await notificationService.getNotifications(userId);
    return Array.isArray(list) ? list.filter((n) => !n.read && !n.is_read).length : 0;
  },

  markAsRead: async (id) => {
    return apiClient.patch(`notifications/${encodeURIComponent(id)}/read`);
  },
};

export default notificationService;
