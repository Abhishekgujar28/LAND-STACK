import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Main Government Header component with Emblem and DoLR branding
 */
export const Header = ({ className = '', actions = null }) => {
  return (
    <header
      className={`ux4g-header ${className}`.trim()}
      style={{
        background: '#ffffff',
        borderBottom: '2px solid var(--ux4g-border-subtle)',
        padding: '0.75rem 0',
      }}
    >
      <div className="ux4g-container d-flex justify-between align-center" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--ux4g-primary) 0%, #072a42 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: '0 2px 4px rgba(11,60,93,0.2)',
              border: '2px solid #ff9933',
            }}
          >
            🏛️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ux4g-primary)', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                LAND STACK
              </span>
              <span style={{ fontSize: '0.7rem', background: 'var(--ux4g-primary-light)', color: 'var(--ux4g-primary)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                DILRMP 3.0
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)', letterSpacing: '0.01em', marginTop: '0.1rem' }}>
              National Digital Land Governance & Cadastral Intelligence Mesh
            </div>
          </div>
        </Link>

        <div className="d-flex align-center gap-2" style={{ flexWrap: 'wrap' }}>
          {actions}
        </div>
      </div>
    </header>
  );
};

export default Header;
