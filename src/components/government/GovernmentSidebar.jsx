import React from 'react';
import Sidebar from '../layout/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';

/**
 * GovernmentSidebar - Navigation tailored to the 7 government administrative roles
 * strictly conforming to Section 5 of GOVERNMENT_PORTAL_ARCHITECTURE.md
 */
export const GovernmentSidebar = ({ className = '' }) => {
  const { role, user } = useAuth();

  const getRoleNavItems = () => {
    switch (role) {
      case ROLES.TALATHI:
        return [
          { label: 'Field Verification Queue', path: '/government/talathi', end: true, icon: '📋', badge: '12' },
          { label: 'Village Parcels (7/12)', path: '/government/parcels', icon: '🏛️' },
          { label: 'Cadastral GIS Map', path: '/government/map', icon: '🗺️' },
          { label: 'Form 6 Pencil Entries', path: '/government/mutations', icon: '📝' },
          { label: 'Field Photo Vault', path: '/government/audit', icon: '📸' },
        ];

      case ROLES.TEHSILDAR:
        return [
          { label: 'Statutory Decision Bench', path: '/government/tehsildar', end: true, icon: '⚖️', badge: '18' },
          { label: 'Tehsil Work Queue', path: '/government/work-queue', icon: '📥' },
          { label: 'Revenue Court Hearings', path: '/government/cases', icon: '📅', badge: '4' },
          { label: 'e-Ferfar Mutations', path: '/government/mutations', icon: '📝' },
          { label: 'Cadastral GIS Map', path: '/government/map', icon: '🗺️' },
          { label: 'Tehsil SLA Analytics', path: '/government/analytics', icon: '📈' },
          { label: 'Data Quality Alerts', path: '/government/data-quality', icon: '🛡️' },
        ];

      case ROLES.SRO:
        return [
          { label: 'Pre-Registration Audit', path: '/government/registration', end: true, icon: '🏛️', badge: 'Active' },
          { label: 'Deed Verification', path: '/government/registration/deed-verification', icon: '📜' },
          { label: 'Parcel Registry Search', path: '/government/parcels', icon: '🔍' },
          { label: 'Cadastral GIS Map', path: '/government/map', icon: '🗺️' },
          { label: 'NGDRS Integration Pipeline', path: '/government/integrations', icon: '⚡' },
        ];

      case ROLES.COLLECTOR:
        return [
          { label: 'District Command Cockpit', path: '/government/district', end: true, icon: '🏢', badge: '14 Tehsils' },
          { label: 'Tehsil SLA Overview', path: '/government/district/tehsil-overview', icon: '📊' },
          { label: 'Sec 36A Approvals & Disputes', path: '/government/cases', icon: '⚖️' },
          { label: 'District GIS Map', path: '/government/map', icon: '🗺️' },
          { label: 'District DQI Analytics', path: '/government/analytics', icon: '📈' },
          { label: 'Officer Vigilance & Audit', path: '/government/audit', icon: '📜' },
        ];

      case ROLES.STATE_PMU:
        return [
          { label: 'State PMU Command Center', path: '/government/state', end: true, icon: '📈', badge: '36 Dists' },
          { label: 'Statewide Analytics', path: '/government/state/analytics', icon: '📊' },
          { label: 'State Cadastral GIS', path: '/government/map', icon: '🗺️' },
          { label: 'Adapter Health Grid', path: '/government/integrations', icon: '🔌' },
          { label: 'Data Harmonization & DQI', path: '/government/data-quality', icon: '🛡️' },
        ];

      case ROLES.NATIONAL_MONITOR:
        return [
          { label: 'National Cockpit (DoLR)', path: '/government/national', end: true, icon: '🇮🇳', badge: '36 States' },
          { label: 'Inter-State Benchmarks', path: '/government/national/benchmarks', icon: '🌐' },
          { label: 'National GIS Cadastre', path: '/government/map', icon: '🗺️' },
          { label: 'National Analytics', path: '/government/analytics', icon: '📊' },
          { label: 'DILRMP MIS Reports', path: '/government/audit', icon: '📄' },
        ];

      case ROLES.ADMIN:
      default:
        return [
          { label: 'System Admin Console', path: '/government/admin', end: true, icon: '⚙️', badge: '48 Pods' },
          { label: 'User & Role Management', path: '/government/admin/users', icon: '👥' },
          { label: 'Cluster & System Health', path: '/government/admin/system-health', icon: '🛡️' },
          { label: 'Cryptographic Audit Trail', path: '/government/audit', icon: '🔐' },
          { label: 'Kafka & DLQ Pipeline', path: '/government/integrations', icon: '⚡' },
        ];
    }
  };

  const navItems = getRoleNavItems();
  const title = `${role || 'OFFICER'} WORKSPACE`;

  return <Sidebar title={title} items={navItems} className={className} />;
};

export default GovernmentSidebar;
