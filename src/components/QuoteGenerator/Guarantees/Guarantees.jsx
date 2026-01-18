import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import GlassCard from '../../GlassCard/GlassCard';
import GlassInput from '../../GlassInput/GlassInput';
import './Guarantees.css';

const Guarantees = () => {
  const { quoteData, updateGuarantees } = useQuote();
  const { guarantees } = quoteData;

  const handleChange = (field) => (e) => {
    const value = field === 'legalWarranty' || field === 'hiddenDefectsWarranty' 
      ? e.target.checked 
      : e.target.value;
    updateGuarantees(field, value);
  };

  return (
    <GlassCard variant="default" className="guarantees">
      <h2 className="section-title">Garanties et Service Après-Vente</h2>
      <p className="section-subtitle">Conditions de garantie et service après-vente</p>

      <div className="guarantees-content">
        <div className="guarantees-checkboxes">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={guarantees?.legalWarranty !== false}
              onChange={handleChange('legalWarranty')}
              className="checkbox-input"
            />
            <span>Garantie légale de conformité (obligatoire pour les ventes aux consommateurs)</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={guarantees?.hiddenDefectsWarranty !== false}
              onChange={handleChange('hiddenDefectsWarranty')}
              className="checkbox-input"
            />
            <span>Garantie des vices cachés</span>
          </label>
        </div>

        <div className="guarantees-fields">
          <GlassInput
            label="Durée de garantie (si applicable)"
            value={guarantees?.warrantyDuration || ''}
            onChange={handleChange('warrantyDuration')}
            placeholder="Ex: 24 mois, 1 an, 2 ans"
          />

          <div className="guarantees-textarea">
            <label className="glass-input-label">Service après-vente</label>
            <textarea
              className="glass-input"
              value={guarantees?.afterSalesService || ''}
              onChange={handleChange('afterSalesService')}
              placeholder="Modalités du service après-vente : disponibilité, délais d'intervention, conditions de prise en charge, etc."
              rows={3}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default Guarantees;
