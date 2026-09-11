import React from 'react';

/**
 * UX4G Radio Wrapper
 */
export const Radio = ({
  label,
  id,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  const radioId = id || (name && value ? `${name}-${value}` : undefined);

  return (
    <label htmlFor={radioId} className={`ux4g-radio-label ${className}`.trim()}>
      <input
        type="radio"
        id={radioId}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="ux4g-radio"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

export default Radio;
