import React, { useEffect } from 'react';

/**
 * UX4G Modal Wrapper
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  maxWidth = '550px',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ux4g-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`ux4g-modal-container ${className}`.trim()}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ux4g-card-header" style={{ justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--ux4g-text-secondary)',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>
        <div className="ux4g-card-body" style={{ overflowY: 'auto' }}>
          {children}
        </div>
        {footer && <div className="ux4g-card-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
