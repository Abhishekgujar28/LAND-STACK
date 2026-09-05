import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Standard Government Footer component
 */
export const Footer = ({ className = '' }) => {
  return (
    <footer
      className={`ux4g-footer ${className}`.trim()}
      style={{
        marginTop: 'auto',
        backgroundColor: 'var(--primary-dark, #022319)',
        color: '#ffffff',
        borderTop: '3px solid var(--secondary, #ea580c)',
        padding: '2.5rem 0 1.5rem',
        fontSize: '0.875rem',
      }}
    >
      <div className="ux4g-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div>
            <h4 style={{ color: '#fff', marginBottom: '0.75rem' }}>BharatBhumi Portal</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              Unified digital land registry and cadastral intelligence system. Built under Department of Land Resources, Ministry of Rural Development, Government of India.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '0.75rem' }}>Citizen Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
              <li><Link to="/services" style={{ color: 'rgba(255,255,255,0.8)' }}>7/12 & 8A Extracts</Link></li>
              <li><Link to="/services" style={{ color: 'rgba(255,255,255,0.8)' }}>Property Card</Link></li>
              <li><Link to="/services" style={{ color: 'rgba(255,255,255,0.8)' }}>e-Ferfar Mutation</Link></li>
              <li><Link to="/citizen/search" style={{ color: 'rgba(255,255,255,0.8)' }}>Search Land Records</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '0.75rem' }}>Portals & Logins</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
              <li><Link to="/login/citizen" style={{ color: 'rgba(255,255,255,0.8)' }}>Citizen Login</Link></li>
              <li><Link to="/login/government" style={{ color: 'rgba(255,255,255,0.8)' }}>Officer / Employee Login</Link></li>
              <li><Link to="/help" style={{ color: 'rgba(255,255,255,0.8)' }}>Help & FAQs</Link></li>
              <li><Link to="/contact" style={{ color: 'rgba(255,255,255,0.8)' }}>Grievance Redressal</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '0.75rem' }}>Technical Support</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              Toll-Free Helpline: 1800-120-8040<br />
              Email: support.bharatbhumi@gov.in<br />
              Hours: 9:00 AM - 6:00 PM (Mon-Sat)
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.5rem',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.6)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} BharatBhumi &bull; Department of Land Resources (DoLR), Ministry of Rural Development.
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/about" style={{ color: 'rgba(255,255,255,0.7)' }}>Privacy Policy</Link>
            <Link to="/about" style={{ color: 'rgba(255,255,255,0.7)' }}>Terms of Service</Link>
            <Link to="/about" style={{ color: 'rgba(255,255,255,0.7)' }}>Hyperlink Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
