import React from 'react';

/**
 * Landing Page - GovernmentStrip component (Digital India / DoLR / DILRMP national strip)
 */
export const GovernmentStrip = ({ className = '' }) => {
  return (
    <div
      className={`landing-gov-strip ${className}`.trim()}
      style={{
        background: '#ffffff',
        borderTop: '3px solid var(--ux4g-accent)',
        borderBottom: '1px solid var(--ux4g-border-subtle)',
        padding: '0.75rem 0',
      }}
    >
      <div className="ux4g-container d-flex justify-between align-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontWeight: 700, color: 'var(--ux4g-primary)', fontSize: '0.85rem' }}>
          🇮🇳 National Land Records Modernisation Programme &bull; Digital India Land Initiative
        </div>
        <div className="d-flex align-center gap-4" style={{ fontSize: '0.78rem', color: 'var(--ux4g-text-secondary)' }}>
          <span>Department of Land Resources (DoLR)</span>
          <span>&bull;</span>
          <span>Ministry of Rural Development</span>
          <span>&bull;</span>
          <span>UX4G 3.0 Conforming</span>
        </div>
      </div>
    </div>
  );
};

export default GovernmentStrip;
