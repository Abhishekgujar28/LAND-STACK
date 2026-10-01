import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Layers,
  Map,
  FileText,
  Camera,
  Scale,
  Inbox,
  Calendar,
  BarChart3,
  ShieldAlert,
  ShieldCheck,
  Building,
  Search,
  Zap,
  Globe,
  Users,
  Lock,
  ChevronLeft,
  ChevronRight,
  Landmark,
  BadgeAlert,
  Activity,
  Award,
  Building2,
  Compass,
  FileCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';

/**
 * GovernmentSidebar - Dark Green Collapsible Sidebar for Government Authorities
 * Strictly conforming to SECTION 4 & 5 of GOVERNMENT_PORTAL_ARCHITECTURE.md
 * Features:
 * - Theme: Deep Imperial Cadastral Green gradient
 * - Smooth Collapse/Expand toggle (68px <-> 270px)
 * - Pure semantic Lucide SVG icons (zero emojis)
 * - Real-time queue badges
 * - Officer jurisdiction badge at top
 */
export const GovernmentSidebar = ({
  isCollapsed = false,
  onToggleCollapse = null,
  isMobileDrawer = false,
  onCloseDrawer = null,
  className = '',
}) => {
  const navigate = useNavigate();
  const { role, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      if (onCloseDrawer) onCloseDrawer();
      await logout();
      navigate('/login/government', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login/government', { replace: true });
    }
  };

  // Dynamic Navigation per Role (without static fake badge counts)
  const getRoleNavItems = () => {
    switch (role) {
      case ROLES.TALATHI:
        return [
          { label: 'Field Verification Queue', path: '/government/talathi', end: true, icon: ClipboardList },
          { label: 'Village Land Parcels (RoR)', path: '/government/parcels', icon: Layers },
          { label: 'Cadastral GIS Map', path: '/government/map', icon: Map },
          { label: 'Draft Mutation Entries (Form 6)', path: '/government/mutations', icon: FileText },
          { label: 'Field Photo Inspection', path: '/government/audit', icon: Camera },
        ];

      case ROLES.TEHSILDAR:
        return [
          { label: 'Statutory Decision Bench', path: '/government/tehsildar', end: true, icon: Scale },
          { label: 'Tehsil Work Queue', path: '/government/work-queue', icon: Inbox },
          { label: 'Revenue Court Hearings', path: '/government/cases', icon: Calendar },
          { label: 'Mutation Applications', path: '/government/mutations', icon: FileText },
          { label: 'Cadastral GIS Map', path: '/government/map', icon: Map },
          { label: 'Tehsil SLA Analytics', path: '/government/analytics', icon: BarChart3 },
          { label: 'Data Quality Alerts', path: '/government/data-quality', icon: ShieldAlert },
        ];

      case ROLES.SRO:
        return [
          { label: 'Pre-Registration Audit', path: '/government/registration', end: true, icon: Building },
          { label: 'Deed Verification', path: '/government/registration/deed-verification', icon: FileText },
          { label: 'Parcel Registry Search', path: '/government/parcels', icon: Search },
          { label: 'Cadastral GIS Map', path: '/government/map', icon: Map },
          { label: 'NGDRS Pipeline Monitor', path: '/government/integrations', icon: Zap },
        ];

      case ROLES.COLLECTOR:
        return [
          { label: 'District Command Cockpit', path: '/government/district', end: true, icon: Landmark },
          { label: 'Tehsil SLA Overview', path: '/government/district/tehsil-overview', icon: Activity },
          { label: 'Sec 36A Tribal Approvals', path: '/government/cases', icon: Scale },
          { label: 'District GIS Cadastre', path: '/government/map', icon: Map },
          { label: 'District DQI Analytics', path: '/government/analytics', icon: BarChart3 },
          { label: 'Officer Vigilance & Audit', path: '/government/audit', icon: ShieldCheck },
        ];

      case ROLES.STATE_PMU:
        return [
          { label: 'State PMU Command Center', path: '/government/state', end: true, icon: BarChart3 },
          { label: 'Statewide Analytics', path: '/government/state/analytics', icon: Activity },
          { label: 'State Cadastral GIS', path: '/government/map', icon: Map },
          { label: 'Adapter Health Grid', path: '/government/integrations', icon: Zap },
          { label: 'Harmonization & DQI', path: '/government/data-quality', icon: ShieldAlert },
        ];

      case ROLES.NATIONAL_MONITOR:
        return [
          { label: 'National Cockpit (DoLR)', path: '/government/national', end: true, icon: Globe },
          { label: 'Inter-State Benchmarks', path: '/government/national/benchmarks', icon: Award },
          { label: 'National GIS Cadastre', path: '/government/map', icon: Map },
          { label: 'Governance Analytics', path: '/government/analytics', icon: BarChart3 },
          { label: 'DILRMP MIS Reports', path: '/government/audit', icon: FileText },
        ];

      case ROLES.ULB_OFFICER:
        return [
          { label: 'Urban Property Queue', path: '/government/ulb', end: true, icon: Building2 },
          { label: 'City Survey CTS Cards', path: '/government/ulb?view=cts', icon: FileCheck },
          { label: 'PMRDA 2041 Zoning', path: '/government/ulb?view=zoning', icon: Layers },
          { label: 'Cadastral GIS Map', path: '/government/map?type=urban', icon: Map },
          { label: 'Municipal Sanction Audit', path: '/government/audit', icon: ShieldCheck },
        ];

      case ROLES.SURVEY_GIS:
      case ROLES.SURVEY_OFFICER:
        return [
          { label: 'Spatial Verification Queue', path: '/government/survey', end: true, icon: Layers },
          { label: 'Cadastral GIS Demarcation', path: '/government/map', icon: Map },
          { label: 'ETS Rover & CORS Survey', path: '/government/survey?view=cors', icon: Compass },
          { label: 'Parcel Registry Search', path: '/government/parcels', icon: Search },
          { label: 'Spatial Audit Ledger', path: '/government/audit', icon: ShieldCheck },
        ];

      case ROLES.ADMIN:
      default:
        return [
          { label: 'System Admin Console', path: '/government/admin', end: true, icon: Lock },
          { label: 'User & Role Management', path: '/government/admin/users', icon: Users },
          { label: 'Cluster System Health', path: '/government/admin/system-health', icon: Activity },
          { label: 'Cryptographic Audit', path: '/government/audit', icon: ShieldCheck },
          { label: 'Kafka & DLQ Pipeline', path: '/government/integrations', icon: Zap },
        ];
    }
  };

  const navItems = getRoleNavItems();
  const officerTitle = role ? role.replace('_', ' ') : 'OFFICER';

  return (
    <aside
      className={`govt-sidebar ${className}`.trim()}
      style={{
        width: isCollapsed && !isMobileDrawer ? '68px' : '235px',
        background: 'linear-gradient(180deg, #064e3b 0%, #033628 65%, #022319 100%)',
        color: '#ffffff',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: '100vh',
        height: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden',
        boxShadow: '4px 0 15px rgba(0, 0, 0, 0.15)',
        flexShrink: 0,
      }}
    >
      {/* Officer Header Strip inside Sidebar */}
      <div
        style={{
          padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1.15rem 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        {!isCollapsed ? (
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#fef08a',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {officerTitle} WORKSPACE
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#ffffff',
                marginTop: '0.15rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name || 'Government Officer'}
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'rgba(255, 255, 255, 0.75)',
                marginTop: '0.1rem',
              }}
            >
              Jurisdiction: {
                typeof user?.jurisdiction === 'object' && user?.jurisdiction !== null
                  ? [user.jurisdiction.villageCode, user.jurisdiction.tehsilCode, user.jurisdiction.districtCode, user.jurisdiction.stateCode].filter(Boolean).join(', ') || 'Maharashtra (MH)'
                  : (user?.jurisdiction || 'Maharashtra (MH)')
              }
            </div>
          </div>
        ) : (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fef08a',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
            title={`${officerTitle} Workspace`}
          >
            {role ? role.charAt(0) : 'G'}
          </div>
        )}

        {/* Collapse Toggle Button (Desktop only) */}
        {onToggleCollapse && !isMobileDrawer && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '6px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={`${item.path}-${item.label}`} style={{ marginBottom: '2px' }}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  onClick={() => onCloseDrawer && onCloseDrawer()}
                  title={isCollapsed ? item.label : undefined}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: isCollapsed ? '0' : '0.75rem',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    padding: isCollapsed ? '0.65rem 0' : '0.65rem 1.15rem',
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                    backgroundColor: isActive ? 'rgba(234, 88, 12, 0.22)' : 'transparent',
                    borderLeft: isActive ? '4px solid var(--ux4g-secondary, #ea580c)' : '4px solid transparent',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.825rem',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease-in-out',
                    position: 'relative',
                  })}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                    }
                  }}
                >
                  <Icon
                    size={18}
                    style={{
                      flexShrink: 0,
                      color: 'inherit',
                    }}
                  />

                  {!isCollapsed && (
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '999px',
                        backgroundColor: 'var(--ux4g-secondary, #ea580c)',
                        color: '#ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {isCollapsed && item.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '12px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--ux4g-secondary, #ea580c)',
                      }}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Authority Status Footer & Sign Out */}
      <div
        style={{
          padding: isCollapsed ? '0.75rem 0.5rem' : '0.85rem 1.15rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: 'rgba(0, 0, 0, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {!isCollapsed && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 6px #22c55e',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffffff' }}>
                National Single Sign-On Connected
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.65)' }}>
              DoLR National Land Stack v2.1
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          title="Sign Out of Official Workspace"
          aria-label="Sign Out of Official Workspace"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '0.6rem',
            width: '100%',
            padding: isCollapsed ? '0.55rem' : '0.55rem 0.85rem',
            backgroundColor: 'rgba(239, 68, 68, 0.18)',
            border: '1px solid rgba(239, 68, 68, 0.38)',
            borderRadius: '6px',
            color: '#fca5a5',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.35)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.18)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.38)';
            e.currentTarget.style.color = '#fca5a5';
          }}
        >
          <LogOut size={16} strokeWidth={2.2} />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default GovernmentSidebar;
