import { ROLES } from './roles';

/**
 * Navigation item definitions for public, citizen, and government portals
 */
export const PUBLIC_NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'About', path: '/about' },
  { label: 'Help', path: '/help' },
  { label: 'Contact', path: '/contact' },
];

export const CITIZEN_NAV_ITEMS = [
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

export const GOVERNMENT_NAV_ITEMS = [
  { label: 'Dashboard', path: '/government/dashboard', end: true, icon: '📊' },
  { label: 'Work Queue', path: '/government/work-queue', icon: '📥' },
  { label: 'Parcel Registry', path: '/government/parcels', icon: '🏛️' },
  { label: 'e-Ferfar Workflow', path: '/government/mutations', icon: '📝' },
  { label: 'Court Cases', path: '/government/cases', icon: '⚖️' },
  { label: 'GIS Cadastral Map', path: '/government/map', icon: '🗺️' },
  { label: 'Analytics', path: '/government/analytics', icon: '📈' },
  { label: 'Data Quality', path: '/government/data-quality', icon: '🛡️' },
  { label: 'Integrations', path: '/government/integrations', icon: '🔌' },
  { label: 'Audit Trail', path: '/government/audit', icon: '📜' },
];

export const getNavItemsForRole = (role) => {
  if (role === ROLES.CITIZEN) {
    return CITIZEN_NAV_ITEMS;
  }
  return GOVERNMENT_NAV_ITEMS;
};

export default {
  PUBLIC_NAV_ITEMS,
  CITIZEN_NAV_ITEMS,
  GOVERNMENT_NAV_ITEMS,
  getNavItemsForRole,
};
