import React from 'react';

/**
 * DepartmentPortals - Integrated Land & Property Data Workflow
 * High-resolution expansive architecture diagram showcasing the end-to-end data pipeline.
 */
export const DepartmentPortals = ({ className = '' }) => {
  return (
    <section
      className={`department-portals-section ${className}`.trim()}
      style={{
        padding: '3.5rem 0 4rem',
        background: '#ffffff',
        borderTop: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem', boxSizing: 'border-box' }}>
        {/* Government Section Header */}
        <div className="section-header-compact" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            className="section-eyebrow-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#edf7f3',
              color: '#064e3b',
              padding: '0.25rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            <span className="pill-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#064e3b' }}></span>
            <span>National Land Governance &bull; End-to-End Data Architecture</span>
          </div>
          <h2 className="section-main-heading" style={{ fontSize: '2.15rem', fontWeight: 800, color: '#0f2e24', margin: '0 0 0.45rem' }}>
            Integrated Land &amp; <span className="heading-saffron" style={{ color: '#ea580c' }}>Property Governance Workflow</span>
          </h2>
          <p className="section-sub-heading" style={{ fontSize: '0.96rem', color: '#475569', maxWidth: '820px', margin: '0 auto', lineHeight: 1.6 }}>
            Seamless integration connecting spatial cadastres, deed registration, mutation adjudication, and national property intelligence.
          </p>
        </div>

        {/* Expansive High Resolution Architecture Infographic Image */}
        <div
          style={{
            width: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="/images/Integrated Land and Property Governance Workflow.png"
            alt="Integrated Land and Property Governance Workflow Architecture"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default DepartmentPortals;
