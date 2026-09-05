import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SkipToContent from '../components/layout/SkipToContent';
import BharatBhumiBrand from '../components/layout/BharatBhumiBrand';

/**
 * PublicLayout - Public portal layout with Topbar, Header, Navbar, Outlet, Footer
 * Compact, cohesive layout designed for above-the-fold visibility
 */
export const PublicLayout = () => {
  const loginActions = (
    <div className="d-flex align-center gap-2">
      <Link to="/login/citizen" style={{ textDecoration: 'none' }}>
        <button
          type="button"
          className="btn-nav-citizen"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            borderRadius: '5px',
            padding: '0.28rem 0.8rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
            e.currentTarget.style.borderColor = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
          }}
        >
          <span>👤</span>
          <span>Citizen Login</span>
        </button>
      </Link>
      <Link to="/login/government" style={{ textDecoration: 'none' }}>
        <button
          type="button"
          className="btn-nav-official"
          style={{
            background: 'linear-gradient(135deg, var(--secondary, #ea580c) 0%, var(--secondary-hover, #c2410c) 100%)',
            color: '#ffffff',
            border: '1px solid var(--secondary, #ea580c)',
            borderRadius: '5px',
            padding: '0.28rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(1.08)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'brightness(1)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <span>🏛️</span>
          <span>Official Login</span>
        </button>
      </Link>
    </div>
  );

  return (
    <div className="layout-public" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SkipToContent />
      <Topbar />
      <Header actions={<BharatBhumiBrand size="sm" />} />
      <Navbar actions={loginActions} />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
