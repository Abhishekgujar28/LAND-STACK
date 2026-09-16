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
import UlbDashboard from './urban/UlbDashboard';
import SurveyGisDashboard from './survey/SurveyGisDashboard';

/**
 * GovernmentDashboard - Canonical entry point that dynamically renders
 * the dedicated workspace of the logged-in government role.
 */
export const GovernmentDashboard = () => {
  const { role } = useAuth();

  switch (role) {
    case ROLES.TALATHI:
    case ROLES.PATWARI:
      return <TalathiDashboard />;
    case ROLES.TEHSILDAR:
    case ROLES.CRO:
      return <TehsildarDashboard />;
    case ROLES.ULB_OFFICER:
      return <UlbDashboard />;
    case ROLES.SURVEY_GIS:
    case ROLES.SURVEY_OFFICER:
      return <SurveyGisDashboard />;
    case ROLES.SRO:
      return <RegistrationDashboard />;
    case ROLES.COLLECTOR:
      return <DistrictDashboard />;
    case ROLES.STATE_PMU:
    case ROLES.STATE_AUTHORITY:
      return <StateDashboard />;
    case ROLES.NATIONAL_MONITOR:
    case ROLES.DOLR_NATIONAL:
      return <NationalDashboard />;
    case ROLES.ADMIN:
      return <AdminDashboard />;
    default:
      return <TalathiDashboard />;
  }
};

export default GovernmentDashboard;
