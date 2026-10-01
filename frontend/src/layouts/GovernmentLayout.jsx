import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import GovernmentSidebar from '../components/government/GovernmentSidebar';
import SkipToContent from '../components/layout/SkipToContent';

/**
 * GovernmentLayout - Modern Revenue & Cadastral Officer Console Layout
 * Clean workspace layout with full-height collapsible left sidebar.
 * Automatically expands official map routes to full viewport height.
 */
export const GovernmentLayout = () => {
  const location = useLocation();
  const isFullscreenMap = location.pathname.startsWith('/government/map');

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
        height: isFullscreenMap ? '100vh' : 'auto',
        overflow: isFullscreenMap ? 'hidden' : 'visible',
        backgroundColor: isFullscreenMap ? '#0f172a' : '#f8fafc',
      }}
    >
      <SkipToContent />

      <div
        className="layout-govt-container"
        style={{
          display: 'flex',
          flex: 1,
          position: 'relative',
          minHeight: '100vh',
          height: isFullscreenMap ? '100vh' : 'auto',
          width: '100%',
          overflow: isFullscreenMap ? 'hidden' : 'visible',
        }}
      >
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
            padding: isFullscreenMap ? 0 : '1.25rem 1.5rem',
            backgroundColor: isFullscreenMap ? '#0f172a' : '#ffffff',
            minHeight: '100vh',
            height: isFullscreenMap ? '100vh' : 'auto',
            minWidth: 0,
            overflowX: 'hidden',
            overflowY: isFullscreenMap ? 'hidden' : 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default GovernmentLayout;
