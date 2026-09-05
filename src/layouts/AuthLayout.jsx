import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SkipToContent from '../components/layout/SkipToContent';
import BharatBhumiBrand from '../components/layout/BharatBhumiBrand';

/**
 * AuthLayout - Unified Government Auth Layout
 * Renders the exact same header and navbar as the Landing Page for 100% brand consistency,
 * housing the compact authentication split-card.
 */
export const AuthLayout = () => {
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
            padding: '0.28rem 0.75rem',
            fontSize: '0.78rem',
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
            padding: '0.28rem 0.8rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: '0 2px 4px rgba(234, 88, 12, 0.2)',
          }}
        >
          <span>🏛️</span>
          <span>Official Login</span>
        </button>
      </Link>
    </div>
  );

  return (
    <div
      className="layout-auth"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}
    >
      <SkipToContent />
      {/* 1. Official National Government Topbar */}
      <Topbar />

      {/* 2. Department of Land Resources + BharatBhumi Logo Header (Identical to Landing Page) */}
      <Header brand={<BharatBhumiBrand isSmall={true} />} />

      {/* 3. Official Navigation Bar (Identical to Landing Page) */}
      <Navbar actions={loginActions} />

      {/* 4. Main Content Area Housing the Compact Split Card */}
      <main
        id="main-content"
        style={{
          flex: 1,
          padding: '1.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </main>

      {/* 5. Official Government Footer */}
      <Footer />
    </div>
  );
};

export default AuthLayout;
