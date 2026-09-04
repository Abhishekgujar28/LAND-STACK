import React from 'react';

/**
 * UX4G Empty State Wrapper
 */
export const EmptyState = ({
  icon = '📄',
  title = 'No Data Found',
  description = 'There are no records matching your criteria.',
  action = null,
  className = '',
}) => {
  return (
    <div className={`ux4g-empty-state ${className}`.trim()}>
      <div className="ux4g-empty-state-icon">{icon}</div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--ux4g-text)' }}>
        {title}
      </h3>
      {description && (
        <p style={{ maxWidth: '400px', margin: '0 auto 1.25rem', color: 'var(--ux4g-text-secondary)' }}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
