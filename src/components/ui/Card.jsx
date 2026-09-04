import React from 'react';

/**
 * UX4G Card Wrapper
 */
export const Card = ({
  children,
  header = null,
  footer = null,
  className = '',
  onClick = undefined,
  ...props
}) => {
  return (
    <div
      className={`ux4g-card ${onClick ? 'cursor-pointer' : ''} ${className}`.trim()}
      onClick={onClick}
      {...props}
    >
      {header && <div className="ux4g-card-header">{header}</div>}
      <div className="ux4g-card-body">{children}</div>
      {footer && <div className="ux4g-card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
