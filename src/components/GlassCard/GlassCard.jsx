import React from 'react';
import './GlassCard.css';

const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  onClick,
  ...props 
}) => {
  const cardClass = `glass-card glass-card--${variant} ${className}`.trim();

  return (
    <div 
      className={cardClass}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
