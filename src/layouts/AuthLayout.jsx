import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import SkipToContent from '../components/layout/SkipToContent';

/**
 * AuthLayout - Minimal government auth layout
 */
export const AuthLayout = () => {
  return (
    <div className="layout-auth" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <SkipToContent />
      <Topbar />
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--ux4g-border-subtle)',
          padding: '1rem 0',
        }}
      >
        <div className="ux4g-container d-flex justify-between align-center">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'var(--ux4g-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              LS
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ux4g-primary)' }}>
                LAND STACK
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                Secure Government Access Portal
              </div>
            </div>
          </Link>
          <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--ux4g-primary)', fontWeight: 600 }}>
            &larr; Back to Home
          </Link>
        </div>
      </header>

      <main id="main-content" style={{ flex: 1, padding: '2rem 1rem' }}>
        <Outlet />
      </main>

      <footer style={{ padding: '1rem 0', textAlign: 'center', fontSize: '0.8rem', color: 'var(--ux4g-text-muted)', borderTop: '1px solid var(--ux4g-border-subtle)' }}>
        National Informatics Centre (NIC) &bull; Digital India &bull; UX4G 3.0
      </footer>
    </div>
  );
};

export default AuthLayout;
