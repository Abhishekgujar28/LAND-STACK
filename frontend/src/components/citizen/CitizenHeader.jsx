import React from 'react';
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
  const user = propUser || authUser || { id: 'CIT-001', name: 'Aarav Patil', role: 'CITIZEN' };
  
  const unreadCount = notificationsData.filter(
    (n) => n.userId === (user.id || 'CIT-001') && !n.read
  ).length;

  const actions = (
    <>
      <NotificationBell count={unreadCount} to="/citizen/notifications" />
      <UserMenu user={user} onLogout={logout} />
    </>
  );

  return <Header actions={actions} className={className} />;
};

export default CitizenHeader;
