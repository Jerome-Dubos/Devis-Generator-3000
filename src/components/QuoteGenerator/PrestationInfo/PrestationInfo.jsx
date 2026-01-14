import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import GlassCard from '../../GlassCard/GlassCard';
import GlassInput from '../../GlassInput/GlassInput';
import './PrestationInfo.css';

const PrestationInfo = () => {
  const { quoteData, updatePrestation } = useQuote();
  const { prestation } = quoteData;

  const handleChange = (field) => (e) => {
    updatePrestation(field, e.target.value);
  };

  return (
    <GlassCard variant="default" className="prestation-info">
      <h2 className="section-title">Informations Prestation</h2>
      <p className="section-subtitle">Détails de la prestation proposée</p>

      <div className="prestation-form-grid">
        <GlassInput
          label="Titre de la prestation"
          value={prestation.title}
          onChange={handleChange('title')}
          placeholder="Ex: Organisation d'événement d'entreprise"
          required
        />

        <GlassInput
          label="Objet"
          value={prestation.object}
          onChange={handleChange('object')}
          placeholder="Objet de la prestation"
        />

        <GlassInput
          label="Participants"
          value={prestation.participants}
          onChange={handleChange('participants')}
          placeholder="Nombre de participants ou description"
        />
      </div>
    </GlassCard>
  );
};

export default PrestationInfo;
