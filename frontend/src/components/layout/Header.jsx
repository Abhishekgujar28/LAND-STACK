import React from 'react';
import { Link } from 'react-router-dom';
import emblemSvg from '../../assets/logos/emblem.svg';

/**
 * Main Government Header component with DoLR branding and central national slogans
 * Matches the reference header layout exactly
 */
export const Header = ({ className = '' }) => {
  return (
    <header
      className={`site-header ${className}`.trim()}
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.65rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          flexWrap: 'wrap',
          gap: '1rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Left Side: Department of Land Resources (DoLR), MoRD */}
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Link
            to="/"
            title="Department of Land Resources - Government of India"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.9rem',
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
                height: '56px',
                width: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong
                style={{
                  fontSize: '1.02rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.15,
                  letterSpacing: '0.01em',
                }}
              >
                Bhumi Sansadhan Vibhag
              </strong>
              <h1
                className="h1-logo"
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 800,
                  color: '#064e3b',
                  margin: '1px 0',
                  letterSpacing: '0.01em',
                  lineHeight: 1.15,
                }}
              >
                DEPARTMENT OF LAND RESOURCES
              </h1>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#475569',
                  letterSpacing: '0.03em',
                  lineHeight: 1.15,
                }}
              >
                MINISTRY OF RURAL DEVELOPMENT &bull; GOVT. OF INDIA
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Tricolor Slogan Strip */}
        <div
          className="header-slogan-center d-none d-lg-flex"
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            padding: '0.3rem 2rem',
          }}
        >
          {/* Subtle Tricolour Wavy Ribbon */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              opacity: 0.18,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <svg viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <path d="M10 40 C70 10, 150 55, 290 20" stroke="#FF9933" strokeWidth="6" strokeLinecap="round" />
              <path d="M10 45 C70 15, 150 60, 290 25" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
              <path d="M10 50 C70 20, 150 65, 290 30" stroke="#138808" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div
              style={{
                fontSize: '0.98rem',
                fontWeight: 800,
                color: '#1e293b',
                lineHeight: 1.25,
                letterSpacing: '0.01em',
              }}
            >
              Sabka Bhumi, Sabka Adhikar
            </div>
            <div
              style={{
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#475569',
                lineHeight: 1.25,
                marginTop: '2px',
              }}
            >
              Samriddha Bharat, Sashakt Kisan
            </div>
          </div>
        </div>

        {/* Right Side: BharatBhumi Brand */}
        <div className="header-right d-flex align-center" style={{ flexWrap: 'wrap' }}>
          <Link
            to="/"
            title="BharatBhumi - National Land Portal"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              textAlign: 'right',
              textDecoration: 'none',
              lineHeight: 1.15,
            }}
          >
            <span
              style={{
                fontSize: '0.98rem',
                fontWeight: 800,
                color: '#ea580c',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.01em',
              }}
            >
              Bharat Bhumi
            </span>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#064e3b',
                letterSpacing: '0.02em',
                margin: '1px 0',
              }}
            >
              BHARAT<span style={{ color: '#ea580c' }}>BHUMI</span>
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: '#64748b',
                letterSpacing: '0.02em',
              }}
            >
              National Land Governance Portal
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
