import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldAlert, FileText, Info, HelpCircle } from 'lucide-react';
import BharatBhumiLogo from '../common/BharatBhumiLogo';

/**
 * GIGW 3.0 Standard Government Footer
 * Includes Last Updated metadata, statutory disclosures (RTI Act, Terms of Use,
 * Privacy Policy, Copyright, Accessibility Statement, Sitemap), and Related National Portals.
 */
export const Footer = ({ className = '' }) => {
  return (
    <footer
      className={`ux4g-footer ${className}`.trim()}
      role="contentinfo"
      style={{
        marginTop: 'auto',
        backgroundColor: '#022319',
        color: '#ffffff',
        borderTop: '3px solid #ea580c',
        fontSize: '0.85rem',
      }}
    >
      {/* 1. Related Official National Portals Strip */}
      <div
        style={{
          backgroundColor: '#011912',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.75rem 0',
          fontSize: '0.78rem',
        }}
      >
        <div
          className="ux4g-container"
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>
            Related National Portals:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <a
              href="https://www.digilocker.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span>DigiLocker</span>
              <ExternalLink size={10} />
            </a>
            <a
              href="https://web.umang.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span>UMANG</span>
              <ExternalLink size={10} />
            </a>
            <a
              href="https://www.mygov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span>MyGov India</span>
              <ExternalLink size={10} />
            </a>
            <a
              href="https://www.india.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span>India.gov.in</span>
              <ExternalLink size={10} />
            </a>
            <a
              href="https://data.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span>Data.gov.in</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Columns */}
      <div className="ux4g-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          {/* Column 1: Brand & Ministry Information */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <BharatBhumiLogo size={36} />
              <div>
                <h4 style={{ color: '#fff', margin: 0, fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                  BHARATBHUMI
                </h4>
                <div style={{ fontSize: '0.72rem', color: '#fef08a' }}>
                  National Land Governance Portal
                </div>
              </div>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.82rem', lineHeight: 1.55 }}>
              Unified digital public infrastructure for parcel-centric land records, spatial cadastres, and statutory governance. Built under Department of Land Resources (DoLR), Ministry of Rural Development, Government of India.
            </p>
          </div>

          {/* Column 2: Citizen Services */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>Citizen Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2, fontSize: '0.84rem' }}>
              <li><Link to="/services" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>7/12 & 8A RoR Extracts</Link></li>
              <li><Link to="/services" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Property Card (NOC)</Link></li>
              <li><Link to="/citizen/mutations" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>e-Ferfar Mutation Tracking</Link></li>
              <li><Link to="/citizen/search" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Search by Bhu-Aadhaar (ULPIN)</Link></li>
              <li><Link to="/citizen/due-diligence" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Due Diligence 360° Report</Link></li>
            </ul>
          </div>

          {/* Column 3: Portals & Resources */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>Portals & Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2, fontSize: '0.84rem' }}>
              <li><Link to="/login/citizen" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Citizen Single Sign-On</Link></li>
              <li><Link to="/login/government" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Revenue Officer Workspace</Link></li>
              <li><Link to="/resources" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>DILRMP Manuals & Circulars</Link></li>
              <li><Link to="/help" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Help & Citizen FAQs</Link></li>
              <li><Link to="/contact" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Grievance Redressal (CPGRAMS)</Link></li>
            </ul>
          </div>

          {/* Column 4: Technical Helpline */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>Technical Support</h4>
            <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.82rem', lineHeight: 1.6 }}>
              <div><strong>Toll-Free Helpline:</strong> 1800-120-8040</div>
              <div><strong>Email:</strong> support.bharatbhumi@gov.in</div>
              <div><strong>Hours:</strong> 9:30 AM - 6:00 PM (Mon-Sat)</div>
              <div style={{ marginTop: '0.5rem', color: '#94a3b8' }}>
                NBO Building, Nirman Bhawan, New Delhi - 110011
              </div>
            </div>
          </div>
        </div>

        {/* 3. Statutory Policies & Disclosures Links */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
            gap: '0.85rem',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#cbd5e1' }}>
            <Link to="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Terms of Use</Link>
            <span>&bull;</span>
            <Link to="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Copyright Policy</Link>
            <span>&bull;</span>
            <Link to="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Hyperlink Policy</Link>
            <span>&bull;</span>
            <Link to="/help" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Accessibility Statement</Link>
            <span>&bull;</span>
            <Link to="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>RTI Act Disclosure</Link>
            <span>&bull;</span>
            <Link to="/services" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Sitemap</Link>
          </div>
        </div>

        {/* 4. Last Updated Date & Copyright Metadata */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.2rem',
            fontSize: '0.76rem',
            color: 'rgba(255, 255, 255, 0.6)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} BharatBhumi &bull; Content Owned & Maintained by Department of Land Resources (DoLR), Ministry of Rural Development, Government of India.
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fed7aa', fontWeight: 600 }}>
            <span>Page Last Updated on:</span>
            <span>07 September 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
