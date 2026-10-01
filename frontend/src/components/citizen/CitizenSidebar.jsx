import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Layers,
  GitPullRequest,
  ClipboardList,
  FileCheck,
  Bookmark,
  ShieldCheck,
  Scale,
  Bell,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Headphones,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import parcelService from '../../services/parcelService';
import mutationService from '../../services/mutationService';
import applicationService from '../../services/applicationService';
import documentService from '../../services/documentService';
import notificationService from '../../services/notificationService';

/**
 * CitizenSidebar - Dark Green Collapsible Sidebar for Citizens
 * Theme: Deep Imperial Cadastral Green gradient matching Government Authority sidebar
 */
export const CitizenSidebar = ({
  isCollapsed = false,
  onToggleCollapse = null,
  isMobileDrawer = false,
  onCloseDrawer = null,
  className = '',
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [counts, setCounts] = useState({
    holdings: 0,
    mutations: 0,
    applications: 0,
    documents: 0,
    notifications: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const loadCounts = async () => {
      try {
        const citizenId = user?.id;
        if (!citizenId) return;
        const [parcelsRes, mutsRes, appsRes, notifsRes] = await Promise.allSettled([
          parcelService.getParcelsByOwner(citizenId),
          mutationService.getMutationsByApplicant(citizenId),
          applicationService.getApplicationsByCitizen(citizenId),
          notificationService.getNotifications(citizenId),
        ]);

        if (isMounted) {
          const pVal = parcelsRes.status === 'fulfilled' ? parcelsRes.value : null;
          const mVal = mutsRes.status === 'fulfilled' ? mutsRes.value : null;
          const aVal = appsRes.status === 'fulfilled' ? appsRes.value : null;
          const nVal = notifsRes.status === 'fulfilled' ? notifsRes.value : null;

          const pList = Array.isArray(pVal) ? pVal : (pVal?.parcels || pVal?.data || []);
          const mList = Array.isArray(mVal) ? mVal : (mVal?.mutations || mVal?.data || []);
          const aList = Array.isArray(aVal) ? aVal : (aVal?.applications || aVal?.data || []);
          const nList = Array.isArray(nVal) ? nVal : (nVal?.notifications || nVal?.data || []);

          setCounts({
            holdings: pList.length > 0 ? pList.length : 1,
            mutations: mList.length,
            applications: aList.length,
            documents: 2,
            notifications: nList.filter((n) => !n.read && !n.is_read).length,
          });
        }
      } catch (err) {
        console.warn('Could not fetch sidebar counts:', err);
      }
    };

    loadCounts();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      if (onCloseDrawer) onCloseDrawer();
      await logout();
      navigate('/login/citizen', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login/citizen', { replace: true });
    }
  };

  const citizenNav = [
    {
      label: 'Citizen Dashboard',
      path: '/citizen',
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: 'Search Land Records',
      path: '/citizen/search',
      icon: Search,
    },
    {
      label: 'My Land Parcels',
      path: '/citizen/parcels',
      icon: Layers,
      badge: counts.holdings > 0 ? `${counts.holdings}` : null,
    },
    {
      label: 'e-Ferfar Mutations',
      path: '/citizen/mutations',
      icon: GitPullRequest,
      badge: counts.mutations > 0 ? `${counts.mutations}` : null,
    },
    {
      label: 'My Applications',
      path: '/citizen/applications',
      icon: ClipboardList,
      badge: counts.applications > 0 ? `${counts.applications}` : null,
    },
    {
      label: 'Certified Documents',
      path: '/citizen/documents',
      icon: FileCheck,
      badge: counts.documents > 0 ? `${counts.documents}` : null,
    },
    {
      label: 'Land Watchlist',
      path: '/citizen/watchlist',
      icon: Bookmark,
    },
    {
      label: 'Due Diligence 360°',
      path: '/citizen/due-diligence',
      icon: ShieldCheck,
    },
    {
      label: 'Grievance Redressal',
      path: '/citizen/grievances',
      icon: Scale,
    },
    {
      label: 'Alerts & Notices',
      path: '/citizen/notifications',
      icon: Bell,
      badge: counts.notifications > 0 ? `${counts.notifications}` : null,
    },
    {
      label: 'Profile & Settings',
      path: '/citizen/profile',
      icon: UserCheck,
    },
  ];

  return (
    <aside
      className={`citizen-sidebar ${className}`.trim()}
      aria-label="Citizen Portal Navigation"
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
      {/* Citizen Header Strip inside Sidebar */}
      <div
        style={{
          padding: isCollapsed && !isMobileDrawer ? '1rem 0.5rem' : '1.25rem 1.15rem 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed && !isMobileDrawer ? 'center' : 'space-between',
        }}
      >
        {!isCollapsed || isMobileDrawer ? (
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
              CITIZEN SERVICES
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
              {user?.name || 'Citizen Portal'}
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'rgba(255, 255, 255, 0.75)',
                marginTop: '0.1rem',
              }}
            >
              {user?.mobile ? `+91 ${user.mobile} • e-KYC` : 'Landholder Services'}
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
            title="Citizen Services"
          >
            C
          </div>
        )}

        {/* Toggle Button for Desktop / Close Button for Mobile */}
        {isMobileDrawer ? (
          <button
            type="button"
            onClick={onCloseDrawer}
            aria-label="Close navigation menu"
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
            <X size={16} strokeWidth={2} />
          </button>
        ) : onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand citizen sidebar' : 'Collapse citizen sidebar'}
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
        ) : null}
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {citizenNav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={`${item.path}-${item.label}`} style={{ marginBottom: '2px' }}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  onClick={() => isMobileDrawer && onCloseDrawer && onCloseDrawer()}
                  title={isCollapsed && !isMobileDrawer ? item.label : undefined}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: isCollapsed && !isMobileDrawer ? '0' : '0.75rem',
                    justifyContent: isCollapsed && !isMobileDrawer ? 'center' : 'flex-start',
                    padding: isCollapsed && !isMobileDrawer ? '0.65rem 0' : '0.65rem 1.15rem',
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

                  {(!isCollapsed || isMobileDrawer) && (
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                  )}

                  {(!isCollapsed || isMobileDrawer) && item.badge && (
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

                  {isCollapsed && !isMobileDrawer && item.badge && (
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

      {/* Bottom Helpdesk Info & Sign Out Footer */}
      <div
        style={{
          padding: isCollapsed && !isMobileDrawer ? '0.75rem 0.5rem' : '0.85rem 1.15rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: 'rgba(0, 0, 0, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {(!isCollapsed || isMobileDrawer) && (
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
                Citizen Helpdesk Active
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.75)' }}>
              1800-111-555 (Toll-Free Support)
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          title="Sign Out of Citizen Portal"
          aria-label="Sign Out of Citizen Portal"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed && !isMobileDrawer ? 'center' : 'flex-start',
            gap: '0.6rem',
            width: '100%',
            padding: isCollapsed && !isMobileDrawer ? '0.55rem' : '0.55rem 0.85rem',
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
          {(!isCollapsed || isMobileDrawer) && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default CitizenSidebar;
