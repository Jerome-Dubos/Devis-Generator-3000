import React from 'react';
import './VATSelector.css';

const VAT_RATES = [0, 5.5, 10, 20]; // Taux TVA français

const VATSelector = ({ value, onChange, label, required = false, className = '' }) => {
  const handleSelect = (rate) => {
    onChange({ target: { value: rate.toString() } });
  };

  const currentValue = parseFloat(value) || 0;

  return (
    <div className={`vat-selector-wrapper ${className}`.trim()}>
      {label && (
        <label className="glass-input-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div className="vat-selector-buttons">
        {VAT_RATES.map((rate) => (
          <button
            key={rate}
            type="button"
            className={`vat-selector-button ${currentValue === rate ? 'vat-selector-button--active' : ''}`}
            onClick={() => handleSelect(rate)}
          >
            {rate}%
          </button>
        ))}
      </div>
    </div>
  );
};

export default VATSelector;
