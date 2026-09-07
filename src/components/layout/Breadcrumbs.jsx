import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

/**
 * Breadcrumbs - Universal breadcrumb trail component
 * Maps current URL path to clear GIGW 3.0 compliant navigation hierarchy
 */
const routeNameMap = {
  '': 'Home',
  services: 'Services Directory',
  about: 'About Us',
  resources: 'Resources & Circulars',
  schemes: 'Government Schemes & Acts',
  help: 'Help & FAQs',
  contact: 'Contact Us',
  citizen: 'Citizen Portal',
  search: 'Land Parcel Search',
  mutations: 'e-Ferfar Mutations',
  'due-diligence': 'Due Diligence 360°',
  parcels: 'My Land Parcels',
  documents: 'Documents & Extracts',
  grievances: 'Grievance Redressal',
  login: 'Authentication',
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If on homepage, don't show breadcrumbs
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.6rem 0',
        fontSize: '0.82rem',
      }}
    >
      <div className="ux4g-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1rem' }}>
        <ol
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.45rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          <li style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: '#064e3b',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <Home size={14} strokeWidth={2.2} />
              <span>Home</span>
            </Link>
          </li>

          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = routeNameMap[value.toLowerCase()] || decodeURIComponent(value).replace(/-/g, ' ');

            return (
              <li key={to} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <ChevronRight size={13} color="#94a3b8" strokeWidth={2.5} />
                {isLast ? (
                  <span
                    aria-current="page"
                    style={{
                      color: '#ea580c',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                    }}
                  >
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={to}
                    style={{
                      color: '#064e3b',
                      textDecoration: 'none',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  >
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
