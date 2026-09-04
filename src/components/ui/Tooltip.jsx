import React, { useState } from 'react';

/**
 * UX4G Tooltip Wrapper
 */
export const Tooltip = ({ text, children, position = 'top', className = '' }) => {
  const [visible, setVisible] = useState(false);

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '6px' };
      case 'left':
        return { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '6px' };
      case 'right':
        return { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '6px' };
      case 'top':
      default:
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '6px' };
    }
  };

  return (
    <div
      className={`ux4g-tooltip-wrapper ${className}`.trim()}
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            zIndex: 1000,
            background: 'var(--ux4g-text)',
            color: '#ffffff',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--ux4g-radius-sm)',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: 'var(--ux4g-shadow-md)',
            ...getPositionStyles(),
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
