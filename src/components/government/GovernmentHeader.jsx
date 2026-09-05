import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import UserMenu from '../common/UserMenu';
import Badge from '../ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';

const ROLE_ROUTES = {
  [ROLES.TALATHI]: '/government/talathi',
  [ROLES.TEHSILDAR]: '/government/tehsildar',
  [ROLES.SRO]: '/government/registration',
  [ROLES.COLLECTOR]: '/government/district',
  [ROLES.STATE_PMU]: '/government/state',
  [ROLES.NATIONAL_MONITOR]: '/government/national',
  [ROLES.ADMIN]: '/government/admin',
};

const ROLE_JURISDICTIONS = {
  [ROLES.TALATHI]: 'Wagholi Circle, Haveli Tehsil',
  [ROLES.TEHSILDAR]: 'Haveli Taluka (112 Villages)',
  [ROLES.SRO]: 'Sub-Registrar Haveli No 5',
  [ROLES.COLLECTOR]: 'Pune District (14 Tehsils)',
  [ROLES.STATE_PMU]: 'Maharashtra State PMU',
  [ROLES.NATIONAL_MONITOR]: 'National Monitor (DoLR)',
  [ROLES.ADMIN]: 'System Admin (NIC Cloud)',
};

/**
 * GovernmentHeader component with dynamic jurisdiction badge and 7-role switcher
 */
export const GovernmentHeader = ({ className = '' }) => {
  const navigate = useNavigate();
  const { user, role, switchOfficerRole, logout, availableRoles } = useAuth();

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    switchOfficerRole(newRole);
    if (ROLE_ROUTES[newRole]) {
      navigate(ROLE_ROUTES[newRole]);
    }
  };

  const jurisdictionText = user?.jurisdiction || ROLE_JURISDICTIONS[role] || 'Government Operations';

  const actions = (
    <div className="d-flex align-center gap-3">
      {/* 7-Role Quick Switcher for Easy Demonstration */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ux4g-text-secondary)', textTransform: 'uppercase' }}>
          Role:
        </span>
        <select
          className="ux4g-select"
          style={{
            padding: '0.25rem 0.6rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--ux4g-primary)',
            background: 'var(--ux4g-primary-light)',
            borderColor: 'var(--ux4g-primary)',
            borderRadius: 'var(--ux4g-radius-md)',
            cursor: 'pointer',
          }}
          value={role || ROLES.TALATHI}
          onChange={handleRoleChange}
        >
          <option value={ROLES.TALATHI}>👤 Talathi (Village)</option>
          <option value={ROLES.TEHSILDAR}>⚖️ Tehsildar (Tehsil)</option>
          <option value={ROLES.SRO}>🏛️ Sub-Registrar (SRO)</option>
          <option value={ROLES.COLLECTOR}>🏢 District Collector</option>
          <option value={ROLES.STATE_PMU}>📈 State PMU Head</option>
          <option value={ROLES.NATIONAL_MONITOR}>🇮🇳 DoLR National Monitor</option>
          <option value={ROLES.ADMIN}>⚙️ System Administrator</option>
        </select>
      </div>

      {/* Dynamic Jurisdiction Badge */}
      <Badge variant="warning" style={{ fontWeight: 600, textTransform: 'none', letterSpacing: 'normal' }}>
        📍 {jurisdictionText}
      </Badge>

      {/* User Profile Avatar Menu */}
      <UserMenu
        user={{
          name: user?.name || 'Government Officer',
          role: role || 'OFFICER',
        }}
        onLogout={logout}
      />
    </div>
  );

  return <Header actions={actions} className={className} />;
};

export default GovernmentHeader;
