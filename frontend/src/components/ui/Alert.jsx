import React from 'react';

/**
 * UX4G Alert Wrapper
 * @param {'info'|'success'|'warning'|'danger'} variant
 */
export const Alert = ({
  children,
  variant = 'info',
  title = '',
  icon = null,
  className = '',
  onClose = null,
  ...props
}) => {
  return (
    <div
      role="alert"
      className={`ux4g-alert ux4g-alert-${variant} ${className}`.trim()}
      {...props}
    >
      {icon && <div className="ux4g-alert-icon">{icon}</div>}
      <div className="ux4g-alert-content" style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{title}</div>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close alert"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'inherit' }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
