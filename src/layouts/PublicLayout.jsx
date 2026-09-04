import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SkipToContent from '../components/layout/SkipToContent';
import Button from '../components/ui/Button';

/**
 * PublicLayout - Public portal layout with Topbar, Header, Navbar, Outlet, Footer
 */
export const PublicLayout = () => {
  const publicActions = (
    <div className="d-flex align-center gap-2">
      <Link to="/login/citizen">
        <Button variant="outline" size="sm">
          Citizen Login
        </Button>
      </Link>
      <Link to="/login/government">
        <Button variant="primary" size="sm">
          Official Login
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="layout-public" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SkipToContent />
      <Topbar />
      <Header actions={publicActions} />
      <Navbar />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
