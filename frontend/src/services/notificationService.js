import apiClient from '../api/client';

/**
 * Service to manage alerts and notifications via backend REST API
 */
export const notificationService = {
  getNotifications: async (userId = null) => {
    let cleanId = null;
    if (typeof userId === 'string' && userId.trim()) {
      cleanId = userId.trim();
    } else if (userId && typeof userId === 'object') {
      cleanId = userId.citizenId || userId.userId || userId.id || null;
    }
    const params = cleanId ? { userId: cleanId } : {};
    return apiClient.get('notifications', params);
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
