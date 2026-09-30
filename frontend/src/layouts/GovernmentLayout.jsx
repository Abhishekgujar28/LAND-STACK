import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import GovernmentSidebar from '../components/government/GovernmentSidebar';
import SkipToContent from '../components/layout/SkipToContent';

/**
 * GovernmentLayout - Modern Revenue & Cadastral Officer Console Layout
 * Clean workspace layout with full-height collapsible left sidebar.
 */
export const GovernmentLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('landstack_govt_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('landstack_govt_sidebar_collapsed', String(isCollapsed));
    } catch {
      // ignore storage errors
    }
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className="layout-government"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}
    >
      <SkipToContent />

      <div style={{ display: 'flex', flex: 1, position: 'relative', minHeight: '100vh' }}>
        {/* Dark Green Collapsible Sidebar */}
        <GovernmentSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />

        {/* Main Workspace Area */}
        <main
          id="main-content"
          style={{
            flex: 1,
            padding: '1.25rem 1.5rem',
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            minWidth: 0,
            overflowX: 'hidden',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default GovernmentLayout;
