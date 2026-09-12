import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Map,
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
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import parcelService from '../../services/parcelService';
import mutationService from '../../services/mutationService';
import applicationService from '../../services/applicationService';
import documentService from '../../services/documentService';
import notificationService from '../../services/notificationService';

/**
 * CitizenSidebar - Professional Sticky Left-Side Citizen Navigation
 */
export const CitizenSidebar = ({
  isCollapsed = false,
  onToggleCollapse,
  isMobileDrawer = false,
  onCloseDrawer,
}) => {
  const { user } = useAuth();
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
        const citizenId = user?.id || 'CIT-001';
        const [parcelsRes, mutsRes, appsRes, notifsRes] = await Promise.allSettled([
          parcelService.getParcelsByOwner(citizenId),
          mutationService.getMutationsByApplicant(citizenId),
          applicationService.getApplicationsByCitizen(citizenId),
          notificationService.getNotifications(citizenId),
        ]);

        if (isMounted) {
          setCounts({
            holdings: parcelsRes.status === 'fulfilled' && Array.isArray(parcelsRes.value) ? parcelsRes.value.length : 0,
            mutations: mutsRes.status === 'fulfilled' && Array.isArray(mutsRes.value) ? mutsRes.value.length : 0,
            applications: appsRes.status === 'fulfilled' && Array.isArray(appsRes.value) ? appsRes.value.length : 0,
            documents: 2,
            notifications: notifsRes.status === 'fulfilled' && Array.isArray(notifsRes.value) ? notifsRes.value.filter(n => !n.read && !n.is_read).length : 0,
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

  const citizenNav = [
    {
      label: 'Citizen Dashboard',
      path: '/citizen/dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: 'Search Land Records',
      path: '/citizen/search',
      icon: Search,
    },
    {
      label: 'GIS Land Map',
      path: '/citizen/mapping',
      icon: Map,
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
      className={`citizen-sidebar ${isCollapsed && !isMobileDrawer ? 'collapsed' : ''}`}
      aria-label="Citizen Portal Navigation"
    >
      {/* Sidebar Header */}
      <div className="citizen-sidebar-header">
        {!isCollapsed || isMobileDrawer ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--ux4g-primary)',
              }}
            >
              Citizen Services
            </span>
          </div>
        ) : null}

        {/* Toggle Button for Desktop / Close Button for Mobile */}
        {isMobileDrawer ? (
          <button
            type="button"
            onClick={onCloseDrawer}
            className="citizen-sidebar-toggle-btn"
            aria-label="Close navigation menu"
          >
            <X size={18} strokeWidth={2} />
          </button>
        ) : onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="citizen-sidebar-toggle-btn"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand citizen sidebar' : 'Collapse citizen sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight size={18} strokeWidth={2} />
            ) : (
              <ChevronLeft size={18} strokeWidth={2} />
            )}
          </button>
        ) : null}
      </div>

      {/* Navigation Links (Scrollable independently) */}
      <nav className="citizen-sidebar-nav">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {citizenNav.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path} style={{ margin: '2px 0' }}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  onClick={() => isMobileDrawer && onCloseDrawer && onCloseDrawer()}
                  className={({ isActive }) =>
                    `citizen-nav-link ${isActive ? 'active' : ''}`
                  }
                  title={isCollapsed && !isMobileDrawer ? item.label : undefined}
                >
                  <span className="citizen-nav-icon">
                    <IconComponent size={18} strokeWidth={2} />
                  </span>

                  {(!isCollapsed || isMobileDrawer) && (
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                  )}

                  {item.badge && (
                    <span className="citizen-nav-badge" aria-label={`${item.badge} items`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer Helpdesk Info */}
      {(!isCollapsed || isMobileDrawer) && (
        <div
          style={{
            padding: '0.85rem 1rem',
            borderTop: '1px solid var(--ux4g-border-subtle)',
            backgroundColor: 'var(--ux4g-surface-muted)',
            fontSize: '0.75rem',
            color: 'var(--ux4g-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
          }}
        >
          <Headphones size={16} style={{ color: 'var(--ux4g-primary)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ux4g-text)' }}>Citizen Helpdesk</div>
            <div>1800-111-555 (Toll-Free)</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default CitizenSidebar;
