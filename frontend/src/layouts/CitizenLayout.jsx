import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import CitizenHeader from '../components/citizen/CitizenHeader';
import CitizenSidebar from '../components/citizen/CitizenSidebar';
import SkipToContent from '../components/layout/SkipToContent';

/**
 * CitizenLayout - Production-Ready Citizen Portal Layout
 * Features:
 * - Sticky Top Navigation: Official Topbar + Citizen Header
 * - Sticky LEFT-side Citizen Sidebar consistent during page scrolling
 * - Smooth Collapse/Expand toggle (68px <-> 270px)
 * - Clean main content area
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
      <div className="site-sticky-header-wrapper">
        <Topbar />
        <CitizenHeader />
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenLayout;
