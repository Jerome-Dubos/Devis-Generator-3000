import React from 'react';
import './GlassButton.css';

const GlassButton = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const buttonClass = `
    glass-button 
    glass-button--${variant} 
    glass-button--${size}
    ${disabled ? 'glass-button--disabled' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="glass-button-icon glass-button-icon--left">
          {icon}
        </span>
      )}
      <span className="glass-button-text">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="glass-button-icon glass-button-icon--right">
          {icon}
        </span>
      )}
    </button>
  );
};

export default GlassButton;
