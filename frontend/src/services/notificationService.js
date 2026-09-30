import apiClient from '../api/client';

const SRO_NOTIFS_STORAGE_KEY = 'land_stack_sro_notifications';

const DEFAULT_APPT_NOTIFICATIONS = [
  {
    id: 'NOTIF-SRO-001',
    userId: 'CITIZEN-001',
    title: 'New SRO Appointment Scheduled',
    message: 'Your appointment for Property Registration (APP-1025) is scheduled on 05 October 2026 at 10:00 AM at SRO Pune. Please bring the required original documents.',
    type: 'DOCUMENT',
    subType: 'APPOINTMENT_NOTICE',
    parcelId: 'MH-PUN-1025',
    applicationId: 'APP-1025',
    noticeId: 'SRO-2026-001',
    date: '2026-10-01T09:30:00.000Z',
    read: false,
    is_read: false,
  },
];

const getStoredNotifs = () => {
  try {
    const raw = localStorage.getItem(SRO_NOTIFS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SRO_NOTIFS_STORAGE_KEY, JSON.stringify(DEFAULT_APPT_NOTIFICATIONS));
      return DEFAULT_APPT_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_APPT_NOTIFICATIONS;
  }
};

const saveStoredNotifs = (list) => {
  try {
    localStorage.setItem(SRO_NOTIFS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save notifications to localStorage:', err);
  }
};

/**
 * Service to manage alerts and notifications via backend REST API & Local Event Mesh
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
    let remoteList = [];
    try {
      const res = await apiClient.get('notifications', params);
      remoteList = Array.isArray(res) ? res : res?.data || res?.items || [];
    } catch {
      remoteList = [];
    }

    const localList = getStoredNotifs();
    // Merge without duplicates by ID
    const map = new Map();
    [...localList, ...remoteList].forEach((item) => {
      if (item && item.id) map.set(item.id, item);
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0));
  },

  getUnreadCount: async (userId) => {
    const list = await notificationService.getNotifications(userId);
    return Array.isArray(list) ? list.filter((n) => !n.read && !n.is_read).length : 0;
  },

  markAsRead: async (id) => {
    const localList = getStoredNotifs().map((n) => (n.id === id ? { ...n, read: true, is_read: true } : n));
    saveStoredNotifs(localList);
    try {
      return await apiClient.patch(`notifications/${encodeURIComponent(id)}/read`);
    } catch {
      return { success: true };
    }
  },

  markAllAsRead: async (userId) => {
    const localList = getStoredNotifs().map((n) => ({ ...n, read: true, is_read: true }));
    saveStoredNotifs(localList);
    return { success: true };
  },

  addNotification: (notification) => {
    const localList = getStoredNotifs();
    const newNotif = {
      id: `NOTIF-SRO-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString(),
      read: false,
      is_read: false,
      ...notification,
    };
    localList.unshift(newNotif);
    saveStoredNotifs(localList);
    return newNotif;
  },
};

export default notificationService;
