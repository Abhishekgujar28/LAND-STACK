import React from 'react';
import Sidebar from '../layout/Sidebar';

/**
 * GovernmentSidebar - Navigation links for Talathi / Tehsildar / SRO / Collector
 */
export const GovernmentSidebar = ({ role = 'TEHSILDAR', className = '' }) => {
  const govNav = [
    { label: 'Executive Dashboard', path: '/government/dashboard', end: true, icon: '📊' },
    { label: 'Officer Work Queue', path: '/government/work-queue', icon: '📥' },
    { label: 'Parcel Registry', path: '/government/parcels', icon: '🏛️' },
    { label: 'e-Ferfar Workflow', path: '/government/mutations', icon: '📝' },
    { label: 'Revenue Court Cases', path: '/government/cases', icon: '⚖️' },
    { label: 'Cadastral GIS Map', path: '/government/map', icon: '🗺️' },
    { label: 'State & Tehsil Analytics', path: '/government/analytics', icon: '📈' },
    { label: 'Data Quality & Anomaly', path: '/government/data-quality', icon: '🛡️' },
    { label: 'Registry Integrations', path: '/government/integrations', icon: '🔌' },
    { label: 'Audit Trail & Logs', path: '/government/audit', icon: '📜' },
  ];

  return <Sidebar title={`${role} Console`} items={govNav} className={className} />;
};

export default GovernmentSidebar;
