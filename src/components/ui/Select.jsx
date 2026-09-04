import React from 'react';

/**
 * UX4G Select Wrapper
 */
export const Select = ({
  label,
  id,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  error = '',
  helperText = '',
  className = '',
  disabled = false,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`ux4g-form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className={`ux4g-label ${required ? 'ux4g-label-required' : ''}`}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        className={`ux4g-select ${error ? 'ux4g-input-error' : ''}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="ux4g-form-error">{error}</span>}
      {!error && helperText && <span className="ux4g-form-helper">{helperText}</span>}
    </div>
  );
};

export default Select;
