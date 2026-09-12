import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Layers } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import CitizenHeader from '../components/citizen/CitizenHeader';
import CitizenSidebar from '../components/citizen/CitizenSidebar';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SkipToContent from '../components/layout/SkipToContent';

/**
 * CitizenLayout - Production-Ready Citizen Portal Layout
 * Features:
 * - Sticky LEFT-side Citizen Sidebar consistent during page scrolling
 * - Smooth Collapse/Expand toggle (68px <-> 270px)
 * - Off-canvas mobile navigation drawer
 * - Accessible main content area
 * - Pure Lucide SVG icons (zero emojis)
 */
export const CitizenLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('landstack_citizen_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('landstack_citizen_sidebar_collapsed', String(isCollapsed));
    } catch {
      // ignore storage errors
    }
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className="layout-citizen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--ux4g-bg)',
      }}
    >
      <SkipToContent />
      <Topbar />
      <CitizenHeader />

      {/* Mobile Bar with Navigation Drawer Toggle */}
      <div
        className="citizen-mobile-nav-bar no-print"
        style={{
          background: 'var(--ux4g-surface)',
          padding: '0.65rem 1rem',
          borderBottom: '1px solid var(--ux4g-border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          style={{
            background: 'var(--ux4g-primary)',
            color: '#ffffff',
            border: 'none',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--ux4g-radius-md)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          aria-label="Open citizen navigation menu"
        >
          <Menu size={16} strokeWidth={2.2} />
          <span>Citizen Navigation</span>
        </button>

        <div
          style={{
            fontSize: '0.825rem',
            fontWeight: 700,
            color: 'var(--ux4g-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Layers size={15} strokeWidth={2.2} />
          <span>Landholder Services</span>
        </div>
      </div>

      {/* Main Container: Citizen Sidebar (LEFT, Sticky) + Main Content (RIGHT, Scrollable) */}
      <div className="layout-citizen-container">
        {/* Left-Hand Sticky Desktop Sidebar */}
        <CitizenSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />

        {/* Main Content Area */}
        <main id="main-content" className="citizen-main-content">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      {/* Mobile Off-Canvas Drawer */}
      {mobileDrawerOpen && (
        <>
          <div
            className="citizen-drawer-backdrop no-print"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="citizen-drawer-sheet no-print" role="dialog" aria-modal="true">
            <CitizenSidebar
              isMobileDrawer
              onCloseDrawer={() => setMobileDrawerOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CitizenLayout;
