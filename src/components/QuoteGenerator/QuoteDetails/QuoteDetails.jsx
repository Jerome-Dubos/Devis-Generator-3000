import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import GlassCard from '../../GlassCard/GlassCard';
import GlassInput from '../../GlassInput/GlassInput';
import './QuoteDetails.css';

const QuoteDetails = () => {
  const { quoteData, updateQuoteDetails } = useQuote();
  const { quoteDetails } = quoteData;

  const handleChange = (field) => (e) => {
    const value = field === 'isFree' ? e.target.checked : e.target.value;
    updateQuoteDetails(field, value);
  };

  // Calculer la date de validité par défaut (30 jours après la date d'émission)
  const getDefaultValidityDate = () => {
    if (quoteDetails.issueDate) {
      const issueDate = new Date(quoteDetails.issueDate);
      const validityDate = new Date(issueDate);
      validityDate.setDate(validityDate.getDate() + 30);
      return validityDate.toISOString().split('T')[0];
    }
    return '';
  };

  return (
    <GlassCard variant="default" className="quote-details">
      <h2 className="section-title">Détails du Devis</h2>
      <p className="section-subtitle">Informations complémentaires sur le devis</p>

      <div className="quote-details-grid">
        <GlassInput
          label="Numéro de devis"
          value={quoteDetails.quoteNumber}
          onChange={handleChange('quoteNumber')}
          placeholder="DEV-20240101-001"
          required
        />

        <GlassInput
          label="Date d'émission"
          type="date"
          value={quoteDetails.issueDate}
          onChange={handleChange('issueDate')}
          required
        />

        <GlassInput
          label="Date de validité"
          type="date"
          value={quoteDetails.validityDate || getDefaultValidityDate()}
          onChange={handleChange('validityDate')}
          placeholder="Date d'expiration du devis"
        />

        <div className="quote-free-checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={quoteDetails.isFree !== false}
              onChange={handleChange('isFree')}
              className="checkbox-input"
            />
            <span>Devis gratuit</span>
            <span className="checkbox-help">(Cochez si le devis est gratuit, sinon il sera considéré comme payant)</span>
          </label>
        </div>
      </div>

      {quoteDetails.paymentConditions !== undefined && (
        <div className="quote-payment-conditions">
          <label className="glass-input-label">Conditions de paiement</label>
          <textarea
            className="glass-input"
            value={quoteDetails.paymentConditions || ''}
            onChange={handleChange('paymentConditions')}
            placeholder="Modalités de paiement : délais, modes de paiement acceptés (chèque, virement, carte bancaire), échéances, etc."
            rows={3}
          />
        </div>
      )}
    </GlassCard>
  );
};

export default QuoteDetails;
