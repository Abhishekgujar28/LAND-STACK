import React from 'react';
import Sidebar from '../layout/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import ownershipData from '../../data/parcels/ownership.json';
import mutationsData from '../../data/mutations/mutations.json';
import applicationsData from '../../data/applications/applications.json';
import documentsData from '../../data/documents/documents.json';
import notificationsData from '../../data/notifications/notifications.json';

/**
 * CitizenSidebar - Navigation links with dynamic count badges for Citizen portal
 */
export const CitizenSidebar = ({ className = '', onNavClick = null }) => {
  const { user } = useAuth();
  const citizenId = user?.id || 'CIT-001';

  const userHoldingsCount = ownershipData.filter((o) => o.ownerId === citizenId).length;
  const userMutationsCount = mutationsData.filter(
    (m) => m.initiatedBy.includes(citizenId) || (userHoldingsCount > 0 && m.status === 'PENDING')
  ).length;
  const userAppsCount = applicationsData.filter((a) => a.citizenId === citizenId).length;
  const userDocsCount = documentsData.filter((d) => d.userId === citizenId).length;
  const unreadNotifsCount = notificationsData.filter((n) => n.userId === citizenId && !n.read).length;

  const citizenNav = [
    { label: 'Citizen Dashboard', path: '/citizen/dashboard', end: true, icon: '📊' },
    { label: 'Search Land Records', path: '/citizen/search', icon: '🔍' },
    { label: 'My Land Parcels', path: '/citizen/parcels', icon: '🌾', badge: userHoldingsCount > 0 ? `${userHoldingsCount}` : null },
    { label: 'e-Ferfar Mutations', path: '/citizen/mutations', icon: '🔄', badge: userMutationsCount > 0 ? `${userMutationsCount}` : null },
    { label: 'My Applications', path: '/citizen/applications', icon: '📋', badge: userAppsCount > 0 ? `${userAppsCount}` : null },
    { label: 'Certified Documents', path: '/citizen/documents', icon: '📁', badge: userDocsCount > 0 ? `${userDocsCount}` : null },
    { label: 'Land Watchlist', path: '/citizen/watchlist', icon: '⭐' },
    { label: 'Due Diligence 360°', path: '/citizen/due-diligence', icon: '🛡️' },
    { label: 'Grievance Redressal', path: '/citizen/grievances', icon: '⚖️' },
    { label: 'Alerts & Notices', path: '/citizen/notifications', icon: '🔔', badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : null },
    { label: 'Profile & Settings', path: '/citizen/profile', icon: '👤' },
  ];

  return (
    <Sidebar
      title="Citizen Landholder Plane"
      items={citizenNav}
      className={className}
      onNavClick={onNavClick}
    />
  );
};

export default CitizenSidebar;
