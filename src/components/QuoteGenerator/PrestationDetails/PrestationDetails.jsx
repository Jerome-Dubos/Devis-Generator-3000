import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import GlassCard from '../../GlassCard/GlassCard';
import './PrestationDetails.css';

const PrestationDetails = () => {
  const { quoteData, updatePrestationDetails } = useQuote();
  const { prestationDetails } = quoteData;

  const handleChange = (field) => (e) => {
    updatePrestationDetails(field, e.target.value);
  };

  return (
    <GlassCard variant="default" className="prestation-details">
      <h2 className="section-title">Déroulé de la Prestation</h2>
      <p className="section-subtitle">Détaillez les éléments de la prestation</p>

      <div className="prestation-details-grid">
        <div className="textarea-wrapper">
          <label className="glass-input-label">
            Petit déjeuner
          </label>
          <textarea
            className="glass-input"
            value={prestationDetails.petitDejeuner}
            onChange={handleChange('petitDejeuner')}
            placeholder="Détails du petit déjeuner proposé..."
            rows={4}
          />
        </div>

        <div className="textarea-wrapper">
          <label className="glass-input-label">
            Plateaux repas
          </label>
          <textarea
            className="glass-input"
            value={prestationDetails.plateauxRepas}
            onChange={handleChange('plateauxRepas')}
            placeholder="Détails des plateaux repas..."
            rows={4}
          />
        </div>

        <div className="textarea-wrapper">
          <label className="glass-input-label">
            Boissons
          </label>
          <textarea
            className="glass-input"
            value={prestationDetails.boissons}
            onChange={handleChange('boissons')}
            placeholder="Détails des boissons proposées..."
            rows={4}
          />
        </div>

        <div className="textarea-wrapper">
          <label className="glass-input-label">
            Service forfait livraison + rangement
          </label>
          <textarea
            className="glass-input"
            value={prestationDetails.serviceLivraison}
            onChange={handleChange('serviceLivraison')}
            placeholder="Détails du service de livraison et rangement..."
            rows={4}
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default PrestationDetails;
