import React from 'react';

/**
 * UX4G Spinner Wrapper
 * @param {'sm'|'md'|'lg'} size
 */
export const Spinner = ({ size = 'md', className = '', color, ...props }) => {
  const sizeMap = {
    sm: { width: '1rem', height: '1rem', borderWidth: '2px' },
    md: { width: '1.5rem', height: '1.5rem', borderWidth: '3px' },
    lg: { width: '2.5rem', height: '2.5rem', borderWidth: '4px' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`ux4g-spinner ${className}`.trim()}
      style={{
        width: currentSize.width,
        height: currentSize.height,
        borderWidth: currentSize.borderWidth,
        borderTopColor: color || 'var(--ux4g-primary)',
      }}
      {...props}
    />
  );
};

export default Spinner;
