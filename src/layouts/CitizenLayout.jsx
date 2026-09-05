import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import CitizenHeader from '../components/citizen/CitizenHeader';
import CitizenSidebar from '../components/citizen/CitizenSidebar';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SkipToContent from '../components/layout/SkipToContent';
import Footer from '../components/layout/Footer';

/**
 * CitizenLayout - Authenticated citizen portal layout with responsive sidebar and government footer
 */
export const CitizenLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="layout-citizen" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--ux4g-bg)' }}>
      <SkipToContent />
      <Topbar />
      <CitizenHeader />

      {/* Mobile Navigation Toggle Bar */}
      <div
        className="d-md-none no-print"
        style={{
          background: 'var(--ux4g-surface-muted)',
          padding: '0.6rem 1rem',
          borderBottom: '1px solid var(--ux4g-border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ux4g-primary)' }}>
          🌾 Citizen Landholder Workspace
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'var(--ux4g-primary)',
            color: '#fff',
            border: 'none',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--ux4g-radius-md)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <span>{mobileMenuOpen ? '✕ Close Menu' : '☰ Citizen Navigation'}</span>
        </button>
      </div>

      <div className="ux4g-container layout-citizen-container" style={{ display: 'flex', flex: 1, padding: 0 }}>
        <div className={`citizen-sidebar-wrapper ${!mobileMenuOpen ? 'd-none-mobile' : ''}`}>
          <CitizenSidebar onNavClick={() => setMobileMenuOpen(false)} />
        </div>

        <main
          id="main-content"
          style={{
            flex: 1,
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            minHeight: 'calc(100vh - 140px)',
            maxWidth: '100%',
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

export default CitizenLayout;
