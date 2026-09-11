import React from 'react';

/**
 * UX4G Input Wrapper
 */
export const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  helperText = '',
  className = '',
  disabled = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`ux4g-form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className={`ux4g-label ${required ? 'ux4g-label-required' : ''}`}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className={`ux4g-input ${error ? 'ux4g-input-error' : ''}`}
        {...props}
      />
      {error && <span id={`${inputId}-error`} className="ux4g-form-error">{error}</span>}
      {!error && helperText && <span id={`${inputId}-helper`} className="ux4g-form-helper">{helperText}</span>}
    </div>
  );
};

export default Input;
