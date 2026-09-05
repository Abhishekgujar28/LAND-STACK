import React from 'react';

/**
 * Landing Page - GovernmentStrip component (Digital India / DoLR national strip)
 * Compact identity strip
 */
export const GovernmentStrip = ({ className = '' }) => {
  return (
    <div
      className={`landing-gov-strip ${className}`.trim()}
      style={{
        background: '#ffffff',
        borderTop: '2px solid var(--secondary, #ea580c)',
        borderBottom: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
        padding: '0.28rem 0',
      }}
    >
      <div className="ux4g-container d-flex justify-between align-center" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontWeight: 700, color: 'var(--primary, #064e3b)', fontSize: '0.78rem' }}>
          🇮🇳 National Land Records Modernisation Programme &bull; Digital India Land Initiative
        </div>
        <div className="d-flex align-center gap-3" style={{ fontSize: '0.74rem', color: 'var(--ux4g-text-secondary, #475569)' }}>
          <span>Department of Land Resources (DoLR)</span>
          <span>&bull;</span>
          <span>Ministry of Rural Development</span>
          <span>&bull;</span>
          <span style={{ color: 'var(--primary, #064e3b)', fontWeight: 600 }}>Government of India</span>
        </div>
      </div>
    </div>
  );
};

export default GovernmentStrip;
