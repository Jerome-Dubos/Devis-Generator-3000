import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import GlassCard from '../../GlassCard/GlassCard';
import GlassInput from '../../GlassInput/GlassInput';
import './QuoteDetails.css';

const QuoteDetails = () => {
  const { quoteData, updateQuoteDetails } = useQuote();
  const { quoteDetails } = quoteData;

  const handleChange = (field) => (e) => {
    updateQuoteDetails(field, e.target.value);
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
        />
      </div>
    </GlassCard>
  );
};

export default QuoteDetails;
