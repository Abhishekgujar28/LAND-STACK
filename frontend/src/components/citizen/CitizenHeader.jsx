import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import UserMenu from '../common/UserMenu';
import NotificationBell from '../common/NotificationBell';
import { useAuth } from '../../hooks/useAuth';
import notificationService from '../../services/notificationService';

/**
 * CitizenHeader component with active user context and unread alert counts
 */
export const CitizenHeader = ({ user: propUser, className = '' }) => {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const user = propUser || (isAuthenticated ? authUser : null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await notificationService.getNotifications(user.id);
        const notifs = res?.data || res || [];
        if (isMounted && Array.isArray(notifs)) {
          setUnreadCount(notifs.filter((n) => !n.read && !n.is_read).length);
        }
      } catch {
        if (isMounted) setUnreadCount(0);
      }
    };

    fetchNotifications();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const actions = user ? (
    <>
      <NotificationBell count={unreadCount} to="/citizen/notifications" />
      <UserMenu user={user} onLogout={logout} />
    </>
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Link
        to="/login/citizen"
        style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--ux4g-primary, #064e3b)',
          textDecoration: 'none',
          padding: '0.4rem 0.85rem',
          borderRadius: '6px',
          border: '1px solid var(--ux4g-primary, #064e3b)',
        }}
      >
        Sign In
      </Link>
    </div>
  );

  return <Header actions={actions} className={className} />;
};

export default CitizenHeader;
