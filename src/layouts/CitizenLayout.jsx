import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import CitizenHeader from '../components/citizen/CitizenHeader';
import CitizenSidebar from '../components/citizen/CitizenSidebar';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SkipToContent from '../components/layout/SkipToContent';

/**
 * CitizenLayout - Authenticated citizen portal layout with sidebar
 */
export const CitizenLayout = () => {
  return (
    <div className="layout-citizen" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--ux4g-bg)' }}>
      <SkipToContent />
      <Topbar />
      <CitizenHeader />
      <div className="ux4g-container" style={{ display: 'flex', flex: 1, padding: 0 }}>
        <CitizenSidebar />
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

export default CitizenLayout;
