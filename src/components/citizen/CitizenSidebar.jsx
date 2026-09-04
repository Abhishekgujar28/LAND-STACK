import React from 'react';
import Sidebar from '../layout/Sidebar';

/**
 * CitizenSidebar - Navigation links for Citizen portal
 */
export const CitizenSidebar = ({ className = '' }) => {
  const citizenNav = [
    { label: 'Dashboard', path: '/citizen/dashboard', end: true, icon: '📊' },
    { label: 'Search Records', path: '/citizen/search', icon: '🔍' },
    { label: 'My Land Parcels', path: '/citizen/parcels', icon: '🌾' },
    { label: 'e-Ferfar Mutations', path: '/citizen/mutations', icon: '🔄' },
    { label: 'Applications', path: '/citizen/applications', icon: '📋' },
    { label: 'My Documents', path: '/citizen/documents', icon: '📁' },
    { label: 'Watchlist', path: '/citizen/watchlist', icon: '⭐' },
    { label: 'Due Diligence 360', path: '/citizen/due-diligence', icon: '🛡️' },
    { label: 'Grievances', path: '/citizen/grievances', icon: '⚖️' },
    { label: 'Notifications', path: '/citizen/notifications', icon: '🔔' },
    { label: 'Profile Settings', path: '/citizen/profile', icon: '👤' },
  ];

  return <Sidebar title="Citizen Portal" items={citizenNav} className={className} />;
};

export default CitizenSidebar;
