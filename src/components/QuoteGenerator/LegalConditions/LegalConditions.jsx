import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import GlassCard from '../../GlassCard/GlassCard';
import GlassInput from '../../GlassInput/GlassInput';
import './LegalConditions.css';

const LegalConditions = () => {
  const { quoteData, updateLegalConditions } = useQuote();
  const { legalConditions } = quoteData;

  const handleChange = (field) => (e) => {
    updateLegalConditions(field, e.target.value);
  };

  return (
    <GlassCard variant="default" className="legal-conditions">
      <h2 className="section-title">Conditions Légales</h2>
      <p className="section-subtitle">Mentions légales et conditions particulières</p>

      <div className="legal-conditions-grid">
        <div className="textarea-wrapper">
          <label className="glass-input-label">
            Accompte versé
          </label>
          <textarea
            className="glass-input"
            value={legalConditions.accompte}
            onChange={handleChange('accompte')}
            placeholder="Montant et conditions de l'accompte..."
            rows={3}
          />
        </div>

        <div className="textarea-wrapper">
          <label className="glass-input-label">
            Décharge de responsabilité après livraison
          </label>
          <textarea
            className="glass-input"
            value={legalConditions.decharge}
            onChange={handleChange('decharge')}
            placeholder="Conditions de décharge de responsabilité..."
            rows={3}
          />
        </div>

        <div className="textarea-wrapper full-width">
          <label className="glass-input-label">
            Mentions légales
          </label>
          <textarea
            className="glass-input"
            value={legalConditions.mentionsLegales}
            onChange={handleChange('mentionsLegales')}
            placeholder="Autres mentions légales..."
            rows={4}
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default LegalConditions;
