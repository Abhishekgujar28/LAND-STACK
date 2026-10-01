import React from 'react';

/**
 * ProcessWorkflow - How BharatBhumi Manages Land Governance
 * High-resolution expansive architecture infographic image showcasing the end-to-end governance lifecycle.
 */
export const ProcessWorkflow = ({ className = '' }) => {
  return (
    <section
      className={`landing-workflow-section ${className}`.trim()}
      style={{
        padding: '3.5rem 0 4rem',
        background: '#ffffff',
        borderTop: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem', boxSizing: 'border-box' }}>
        {/* Section Header */}
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
            <span>End-to-End Governance Architecture &bull; Lifecycle Process</span>
          </div>
          <h2 className="section-main-heading" style={{ fontSize: '2.15rem', fontWeight: 800, color: '#0f2e24', margin: '0 0 0.45rem' }}>
            How BharatBhumi <span className="heading-saffron" style={{ color: '#ea580c' }}>Manages Land Governance</span>
          </h2>
          <p className="section-sub-heading" style={{ fontSize: '0.96rem', color: '#475569', maxWidth: '820px', margin: '0 auto', lineHeight: 1.6 }}>
            A unified, transparent digital public infrastructure seamlessly linking citizens, revenue officers, registration authorities, and judicial registries.
          </p>
        </div>

        {/* Expansive High Resolution Governance Infographic Image (clean, borderless) */}
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
            src="/images/Integrated Land Governance Workflow.png"
            alt="How BharatBhumi Manages Land Governance Workflow Architecture"
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

export default ProcessWorkflow;
