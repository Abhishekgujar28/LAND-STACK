import React from 'react';

/**
 * Topbar - Standard Indian Government header strip
 */
export const Topbar = ({ className = '' }) => {
  return (
    <div
      className={`ux4g-topbar ${className}`.trim()}
      style={{
        background: '#072a42',
        color: '#ffffff',
        fontSize: '0.78rem',
        padding: '0.35rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="ux4g-container d-flex justify-between align-center">
        <div className="d-flex align-center gap-2">
          <span>भारत सरकार | Government of India</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>महाराष्ट्र शासन | Government of Maharashtra</span>
        </div>
        <div className="d-flex align-center gap-3">
          <a href="#main-content" style={{ color: '#fff', fontSize: '0.78rem' }}>
            Skip to Content
          </a>
          <span style={{ opacity: 0.5 }}>|</span>
          <div className="d-flex align-center gap-1">
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              A-
            </button>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              A
            </button>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              A+
            </button>
          </div>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ cursor: 'pointer' }}>मराठी / English</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
