import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';

// Role Dashboards
import TalathiDashboard from './revenue/TalathiDashboard';
import TehsildarDashboard from './revenue/TehsildarDashboard';
import RegistrationDashboard from './registration/RegistrationDashboard';
import DistrictDashboard from './district/DistrictDashboard';
import StateDashboard from './state/StateDashboard';
import NationalDashboard from './national/NationalDashboard';
import AdminDashboard from './admin/AdminDashboard';

/**
 * GovernmentDashboard - Canonical entry point that dynamically renders
 * the dedicated workspace of the logged-in government role.
 */
export const GovernmentDashboard = () => {
  const { role } = useAuth();

  switch (role) {
    case ROLES.TALATHI:
      return <TalathiDashboard />;
    case ROLES.TEHSILDAR:
      return <TehsildarDashboard />;
    case ROLES.SRO:
      return <RegistrationDashboard />;
    case ROLES.COLLECTOR:
      return <DistrictDashboard />;
    case ROLES.STATE_PMU:
      return <StateDashboard />;
    case ROLES.NATIONAL_MONITOR:
      return <NationalDashboard />;
    case ROLES.ADMIN:
      return <AdminDashboard />;
    default:
      return <TalathiDashboard />;
  }
};

export default GovernmentDashboard;
