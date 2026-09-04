import React from 'react';

/**
 * UX4G Checkbox Wrapper
 */
export const Checkbox = ({
  label,
  id,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label htmlFor={checkboxId} className={`ux4g-checkbox-label ${className}`.trim()}>
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="ux4g-checkbox"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

export default Checkbox;
