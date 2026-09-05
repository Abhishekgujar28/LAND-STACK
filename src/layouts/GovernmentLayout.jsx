import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import GovernmentHeader from '../components/government/GovernmentHeader';
import GovernmentSidebar from '../components/government/GovernmentSidebar';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SkipToContent from '../components/layout/SkipToContent';
import Footer from '../components/layout/Footer';

/**
 * GovernmentLayout - Modern Revenue & Cadastral Officer Console Layout
 * Features:
 * - Sticky LEFT-side Dark Green Government Sidebar
 * - Smooth Collapse/Expand toggle (68px <-> 270px)
 * - Accessible breadcrumbs and full-width main workspace
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
      <Topbar />
      <GovernmentHeader />

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
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
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            minHeight: 'calc(100vh - 120px)',
            minWidth: 0,
            overflowX: 'hidden',
          }}
        >
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default GovernmentLayout;
