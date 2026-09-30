import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import CitizenSidebar from '../components/citizen/CitizenSidebar';
import SkipToContent from '../components/layout/SkipToContent';

/**
 * CitizenLayout - Production-Ready Citizen Portal Layout
 * Clean full-height dashboard workspace layout with left-hand sticky sidebar.
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
        backgroundColor: 'var(--ux4g-bg, #f8fafc)',
      }}
    >
      <SkipToContent />

      {/* Main Container: Citizen Sidebar (LEFT, Sticky) + Main Content (RIGHT, Scrollable) */}
      <div className="layout-citizen-container" style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        {/* Left-Hand Sticky Desktop Sidebar */}
        <CitizenSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />

        {/* Main Content Area */}
        <main
          id="main-content"
          className="citizen-main-content"
          style={{
            flex: 1,
            padding: '1.25rem 1.5rem',
            minHeight: '100vh',
            minWidth: 0,
            overflowX: 'hidden',
            backgroundColor: '#f8fafc',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenLayout;
