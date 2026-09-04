import React from 'react';
import Header from '../layout/Header';
import UserMenu from '../common/UserMenu';
import NotificationBell from '../common/NotificationBell';

/**
 * CitizenHeader component
 */
export const CitizenHeader = ({ user, notificationCount = 3, className = '' }) => {
  const actions = (
    <>
      <NotificationBell count={notificationCount} to="/citizen/notifications" />
      <UserMenu user={user || { name: 'Aarav Patil', role: 'CITIZEN' }} />
    </>
  );

  return <Header actions={actions} className={className} />;
};

export default CitizenHeader;
