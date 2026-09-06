import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { User, Landmark } from 'lucide-react';
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
            background: '#ffffff',
            color: '#064e3b',
            border: '1.5px solid #064e3b',
            borderRadius: '6px',
            padding: '0.35rem 0.95rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#064e3b';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#064e3b';
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
            background: '#0f172a',
            color: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '6px',
            padding: '0.35rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 2px 4px rgba(15, 23, 42, 0.25)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#334155';
            e.currentTarget.style.borderColor = '#334155';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0f172a';
            e.currentTarget.style.borderColor = '#0f172a';
          }}
        >
          <Landmark size={15} strokeWidth={2.2} />
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
