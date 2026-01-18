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
          label="Titre de la prestation *"
          value={prestation.title}
          onChange={handleChange('title')}
          placeholder="Ex: Développement d'application web"
          required
        />

        <GlassInput
          label="Objet"
          value={prestation.object}
          onChange={handleChange('object')}
          placeholder="Objet de la prestation"
        />

        <GlassInput
          label="Participants / Bénéficiaires"
          value={prestation.participants}
          onChange={handleChange('participants')}
          placeholder="Nombre de participants ou description"
        />

        <GlassInput
          label="Date de début de la prestation"
          type="date"
          value={prestation.startDate}
          onChange={handleChange('startDate')}
          placeholder="Date prévue de démarrage"
        />

        <GlassInput
          label="Durée estimée"
          value={prestation.estimatedDuration}
          onChange={handleChange('estimatedDuration')}
          placeholder="Ex: 3 mois, 15 jours, 6 semaines"
        />

        <div className="prestation-delivery-conditions full-width">
          <label className="glass-input-label">Conditions de livraison / d'exécution</label>
          <textarea
            className="glass-input"
            value={prestation.deliveryConditions || ''}
            onChange={handleChange('deliveryConditions')}
            placeholder="Modalités de livraison, lieu d'exécution, délais, étapes de validation, etc."
            rows={3}
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default PrestationInfo;
