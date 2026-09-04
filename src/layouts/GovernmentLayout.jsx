import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import GovernmentHeader from '../components/government/GovernmentHeader';
import GovernmentSidebar from '../components/government/GovernmentSidebar';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SkipToContent from '../components/layout/SkipToContent';

/**
 * GovernmentLayout - Revenue officer console layout
 */
export const GovernmentLayout = () => {
  return (
    <div className="layout-government" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--ux4g-bg)' }}>
      <SkipToContent />
      <Topbar />
      <GovernmentHeader />
      <div className="ux4g-container" style={{ display: 'flex', flex: 1, padding: 0 }}>
        <GovernmentSidebar />
        <main
          id="main-content"
          style={{
            flex: 1,
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            minHeight: 'calc(100vh - 120px)',
          }}
        >
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default GovernmentLayout;
