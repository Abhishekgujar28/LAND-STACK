import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import UserMenu from '../common/UserMenu';
import NotificationBell from '../common/NotificationBell';
import { useAuth } from '../../hooks/useAuth';
import notificationService from '../../services/notificationService';

/**
 * CitizenHeader component with active user context and unread alert counts
 */
export const CitizenHeader = ({ user: propUser, className = '' }) => {
  const { user: authUser, logout } = useAuth();
  const user = propUser || authUser || { id: 'TEST_CIT_001', name: 'Abhishek Gujar', role: 'CITIZEN' };
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchNotifications = async () => {
      try {
        const userId = user?.id || 'TEST_CIT_001';
        const res = await notificationService.getNotifications(userId);
        const notifs = res?.data || res || [];
        if (isMounted && Array.isArray(notifs)) {
          setUnreadCount(notifs.filter((n) => !n.read).length);
        }
      } catch (err) {
        if (isMounted) setUnreadCount(0);
      }
    };

    fetchNotifications();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const actions = (
    <>
      <NotificationBell count={unreadCount} to="/citizen/notifications" />
      <UserMenu user={user} onLogout={logout} />
    </>
  );

  return <Header actions={actions} className={className} />;
};

export default CitizenHeader;
