import React from 'react';
import './GlassInput.css';

const GlassInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const inputId = `glass-input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`glass-input-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="glass-input-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`glass-input ${error ? 'glass-input--error' : ''}`.trim()}
        required={required}
        {...props}
      />
      {error && (
        <span className="glass-input-error">{error}</span>
      )}
    </div>
  );
};

export default GlassInput;
