import React from 'react';
import { NavLink } from 'react-router-dom';
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
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ownershipData from '../../data/parcels/ownership.json';
import mutationsData from '../../data/mutations/mutations.json';
import applicationsData from '../../data/applications/applications.json';
import documentsData from '../../data/documents/documents.json';
import notificationsData from '../../data/notifications/notifications.json';

/**
 * CitizenSidebar - Professional Sticky Left-Side Citizen Navigation
 * Supports:
 * - Clean left-side positioning
 * - Sticky / consistent viewport height during scrolling
 * - Smooth Collapse (icons only) & Expand (icons + labels)
 * - Semantic Lucide SVG icons (zero emojis)
 * - Real-time dynamic count badges from @data
 * - Off-canvas mobile/tablet drawer support
 */
export const CitizenSidebar = ({
  isCollapsed = false,
  onToggleCollapse = null,
  isMobileDrawer = false,
  onCloseDrawer = null,
}) => {
  const { user } = useAuth();
  const citizenId = user?.id || 'CIT-001';

  const userHoldingsCount = ownershipData.filter((o) => o.ownerId === citizenId).length;
  const userMutationsCount = mutationsData.filter(
    (m) => m.initiatedBy.includes(citizenId) || (userHoldingsCount > 0 && m.status === 'PENDING')
  ).length;
  const userAppsCount = applicationsData.filter((a) => a.citizenId === citizenId).length;
  const userDocsCount = documentsData.filter((d) => d.userId === citizenId).length;
  const unreadNotifsCount = notificationsData.filter((n) => n.userId === citizenId && !n.read).length;

  const citizenNav = [
    {
      label: 'Citizen Dashboard',
      path: '/citizen/dashboard',
      end: true,
      icon: LayoutDashboard,
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
      badge: userHoldingsCount > 0 ? `${userHoldingsCount}` : null,
    },
    {
      label: 'e-Ferfar Mutations',
      path: '/citizen/mutations',
      icon: GitPullRequest,
      badge: userMutationsCount > 0 ? `${userMutationsCount}` : null,
    },
    {
      label: 'My Applications',
      path: '/citizen/applications',
      icon: ClipboardList,
      badge: userAppsCount > 0 ? `${userAppsCount}` : null,
    },
    {
      label: 'Certified Documents',
      path: '/citizen/documents',
      icon: FileCheck,
      badge: userDocsCount > 0 ? `${userDocsCount}` : null,
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
      badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : null,
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
