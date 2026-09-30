import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { User, Landmark } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import SkipToContent from '../components/layout/SkipToContent';
import BharatBhumiBrand from '../components/layout/BharatBhumiBrand';

/**
 * AuthLayout - Unified Government Auth Layout
 * Renders the exact same header and navbar as the Landing Page for 100% brand consistency,
 * housing the compact authentication split-card.
 */
export const AuthLayout = () => {
  const location = useLocation();
  const isCitizen = location.pathname.includes('/citizen');
  const isOfficial = location.pathname.includes('/government');

  const loginActions = (
    <div className="d-flex align-center gap-2">
      <Link to="/login/citizen" style={{ textDecoration: 'none' }}>
        <button
          type="button"
          className="btn-nav-citizen"
          style={{
            background: isCitizen ? '#064e3b' : '#ffffff',
            color: isCitizen ? '#ffffff' : '#064e3b',
            border: '1.5px solid #064e3b',
            borderRadius: '6px',
            padding: '0.35rem 0.95rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: isCitizen ? '0 2px 4px rgba(6, 78, 59, 0.25)' : 'none',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!isCitizen) {
              e.currentTarget.style.background = '#064e3b';
              e.currentTarget.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (!isCitizen) {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#064e3b';
            }
          }}
        >
          <User size={15} strokeWidth={2.2} />
          <span>Citizen Login</span>
        </button>
      </Link>
      <Link to="/login/government" style={{ textDecoration: 'none' }}>
        <button
          type="button"
          className="btn-nav-official"
          style={{
            background: isOfficial ? '#c2410c' : '#ea580c',
            color: '#ffffff',
            border: isOfficial ? '1.5px solid #c2410c' : '1.5px solid #ea580c',
            borderRadius: '6px',
            padding: '0.35rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 2px 4px rgba(234, 88, 12, 0.25)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#c2410c';
            e.currentTarget.style.borderColor = '#c2410c';
          }}
          onMouseLeave={(e) => {
            if (!isOfficial) {
              e.currentTarget.style.background = '#ea580c';
              e.currentTarget.style.borderColor = '#ea580c';
            }
          }}
        >
          <Landmark size={15} strokeWidth={2.2} />
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
        background: 'linear-gradient(150deg, #eef2f7 0%, #f0f4f8 40%, #e8f0ec 100%)',
      }}
    >
      <SkipToContent />
      <div className="site-sticky-header-wrapper">
        {/* 1. Official National Government Topbar */}
        <Topbar />

        {/* 2. Department of Land Resources + BharatBhumi Logo Header (Identical to Landing Page) */}
        <Header brand={<BharatBhumiBrand isSmall={true} />} />

        {/* 3. Official Navigation Bar (Identical to Landing Page) */}
        <Navbar actions={loginActions} />
      </div>

      {/* 4. Main Content Area Housing the Compact Split Card */}
      <main
        id="main-content"
        style={{
          flex: 1,
          padding: '2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1280px' }}>
          <Outlet />
        </div>
      </main>

      {/* Minimal Auth Footer Strip */}
      <div
        style={{
          backgroundColor: '#022319',
          borderTop: '3px solid #ea580c',
          padding: '0.9rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        <span>
          &copy; {new Date().getFullYear()} BharatBhumi &bull; Department of Land Resources (DoLR), Ministry of Rural Development, Government of India.
        </span>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          <a href="/about" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Terms of Use</a>
          <a href="/about" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/help"  style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Accessibility</a>
          <a href="/about" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>RTI Disclosure</a>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
