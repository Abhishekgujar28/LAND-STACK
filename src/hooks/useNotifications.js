import { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';

/**
 * Hook to manage user notifications and unread badges
 */
export const useNotifications = (userId = 'CIT-001') => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [items, unread] = await Promise.all([
          notificationService.getNotifications(userId),
          notificationService.getUnreadCount(userId),
        ]);
        setNotifications(items);
        setUnreadCount(unread);
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
  };
};

export default useNotifications;
