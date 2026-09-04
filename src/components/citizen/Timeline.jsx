import React from 'react';

/**
 * Timeline component for mutation steps & application history
 */
export const Timeline = ({ steps = [], className = '' }) => {
  return (
    <div className={`citizen-timeline ${className}`.trim()} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
      <div
        style={{
          position: 'absolute',
          left: '7px',
          top: '8px',
          bottom: '8px',
          width: '2px',
          background: 'var(--ux4g-border)',
        }}
      />
      {steps.map((step, index) => {
        const isCompleted = step.status === 'COMPLETED';
        const isCurrent = step.status === 'CURRENT' || step.status === 'IN_PROGRESS';

        return (
          <div key={index} style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <div
              style={{
                position: 'absolute',
                left: '-1.5rem',
                top: '4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: isCompleted
                  ? 'var(--ux4g-success)'
                  : isCurrent
                  ? 'var(--ux4g-primary)'
                  : 'var(--ux4g-border)',
                border: '2px solid #ffffff',
                boxShadow: isCurrent ? '0 0 0 3px rgba(11,60,93,0.2)' : 'none',
              }}
            />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: isCompleted || isCurrent ? 'var(--ux4g-primary)' : 'var(--ux4g-text-secondary)' }}>
                  {step.title}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{step.date}</span>
              </div>
              {step.description && (
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.825rem', color: 'var(--ux4g-text-secondary)' }}>
                  {step.description}
                </p>
              )}
              {step.actor && (
                <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', marginTop: '0.2rem' }}>
                  By: {step.actor}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
