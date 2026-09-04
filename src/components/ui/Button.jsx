import React from 'react';

/**
 * UX4G Button Wrapper
 * @param {'primary'|'secondary'|'outline'|'ghost'|'success'|'warning'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  icon = null,
  ...props
}) => {
  const variantClass = `ux4g-btn-${variant}`;
  const sizeClass = size !== 'md' ? `ux4g-btn-${size}` : '';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`ux4g-btn ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {icon && <span className="ux4g-btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
