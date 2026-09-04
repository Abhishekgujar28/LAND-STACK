import React, { useState, useRef, useEffect } from 'react';

/**
 * UX4G Dropdown Wrapper
 */
export const Dropdown = ({
  trigger,
  children,
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`ux4g-dropdown ${className}`.trim()}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <div onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className="ux4g-dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            [align]: 0,
            marginTop: '0.25rem',
            background: 'var(--ux4g-surface)',
            border: '1px solid var(--ux4g-border-subtle)',
            borderRadius: 'var(--ux4g-radius-md)',
            boxShadow: 'var(--ux4g-shadow-md)',
            minWidth: '180px',
            zIndex: 100,
            padding: '0.5rem 0',
          }}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, active = false, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        color: active ? 'var(--ux4g-primary)' : 'var(--ux4g-text)',
        backgroundColor: active ? 'var(--ux4g-primary-light)' : 'transparent',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--ux4g-surface-muted)')}
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = active ? 'var(--ux4g-primary-light)' : 'transparent')
      }
    >
      {children}
    </div>
  );
};

export default Dropdown;
