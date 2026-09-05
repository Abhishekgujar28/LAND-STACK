import React from 'react';
import { Link } from 'react-router-dom';
import BharatBhumiBrand from './BharatBhumiBrand';
import emblemSvg from '../../assets/logos/emblem.svg';

/**
 * Main Government Header component with Emblem and DoLR branding
 * Compact, high-density layout aligned with dolr.gov.in standards
 */
export const Header = ({ className = '', actions = null, showBharatBhumi = true }) => {
  return (
    <header
      className={`site-header ${className}`.trim()}
      style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
        padding: '0.35rem 0',
      }}
    >
      <div
        className="ux4g-container d-flex justify-between align-center"
        style={{ flexWrap: 'wrap', gap: '0.75rem' }}
      >
        {/* Left Side: Department of Land Resources (DoLR), MoRD */}
        <div className="logo">
          <Link
            to="/"
            title="Department of Land Resources - Go to home"
            className="site_logo"
            rel="home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <img
              id="logo"
              className="emblem"
              src={emblemSvg}
              onError={(e) => {
                e.currentTarget.src = 'https://dolr.gov.in/wp-content/themes/sdo-theme/images/emblem.svg';
              }}
              alt="State Emblem of India"
              style={{
                height: '46px',
                width: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />

            <div className="logo_text" style={{ display: 'flex', flexDirection: 'column' }}>
              <strong
                lang="hi"
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#1f2937',
                  lineHeight: 1.15,
                  fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif', system-ui",
                }}
              >
                भूमि संसाधन विभाग
              </strong>
              <h1
                className="h1-logo"
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: 'var(--primary, #064e3b)',
                  margin: 0,
                  letterSpacing: '0.01em',
                  lineHeight: 1.15,
                }}
              >
                DEPARTMENT OF LAND RESOURCES
              </h1>
              <span
                className="logo-sub-title"
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  color: '#64748b',
                  letterSpacing: '0.03em',
                  lineHeight: 1.15,
                  marginTop: '1px',
                }}
              >
                MINISTRY OF RURAL DEVELOPMENT &bull; GOVT OF INDIA
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: BharatBhumi Brand or Actions */}
        <div className="header-right d-flex align-center gap-3" style={{ flexWrap: 'wrap' }}>
          {actions ? actions : showBharatBhumi && <BharatBhumiBrand size="sm" />}
        </div>
      </div>
    </header>
  );
};

export default Header;
