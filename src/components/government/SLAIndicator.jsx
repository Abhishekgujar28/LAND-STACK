import React from 'react';
import Badge from '../ui/Badge';

/**
 * SLAIndicator - Service Level Agreement compliance indicator
 */
export const SLAIndicator = ({ daysRemaining, maxDays = 15, className = '' }) => {
  const percentage = Math.max(0, Math.min(100, ((maxDays - daysRemaining) / maxDays) * 100));

  let variant = 'success';
  if (daysRemaining <= 2) {
    variant = 'danger';
  } else if (daysRemaining <= 5) {
    variant = 'warning';
  }

  return (
    <div className={`gov-sla-indicator ${className}`.trim()} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <Badge variant={variant}>
        {daysRemaining > 0 ? `${daysRemaining} days left` : 'SLA Breached'}
      </Badge>
      <div
        style={{
          width: '50px',
          height: '6px',
          backgroundColor: 'var(--ux4g-surface-muted)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: variant === 'danger' ? 'var(--ux4g-danger)' : variant === 'warning' ? 'var(--ux4g-warning)' : 'var(--ux4g-success)',
          }}
        />
      </div>
    </div>
  );
};

export default SLAIndicator;
