import React from 'react';

/**
 * UX4G Badge Wrapper
 * @param {'primary'|'success'|'warning'|'danger'|'info'|'neutral'} variant
 */
export const Badge = ({
  children,
  variant = 'primary',
  className = '',
  icon = null,
  ...props
}) => {
  return (
    <span className={`ux4g-badge ux4g-badge-${variant} ${className}`.trim()} {...props}>
      {icon && <span className="ux4g-badge-icon">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
