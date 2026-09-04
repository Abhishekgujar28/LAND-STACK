import React from 'react';

/**
 * UX4G Skeleton Wrapper
 */
export const Skeleton = ({
  width = '100%',
  height = '1.25rem',
  circle = false,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`ux4g-skeleton ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius: circle ? '50%' : 'var(--ux4g-radius-md)',
        ...style,
      }}
    />
  );
};

export default Skeleton;
