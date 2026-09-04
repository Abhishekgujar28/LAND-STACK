import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Main Header component with Gov branding and portal title
 */
export const Header = ({ className = '', actions = null }) => {
  return (
    <header
      className={`ux4g-header ${className}`.trim()}
      style={{
        background: '#ffffff',
        borderBottom: '2px solid var(--ux4g-border-subtle)',
        padding: '0.85rem 0',
      }}
    >
      <div className="ux4g-container d-flex justify-between align-center">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--ux4g-primary) 0%, #135284 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              letterSpacing: '0.05em',
            }}
          >
            LS
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ux4g-primary)', lineHeight: 1.1 }}>
              LAND STACK
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ux4g-text-secondary)', letterSpacing: '0.02em' }}>
              Unified Digital Land Records & Cadastral Registry
            </div>
          </div>
        </Link>
        <div className="d-flex align-center gap-3">
          {actions}
        </div>
      </div>
    </header>
  );
};

export default Header;
