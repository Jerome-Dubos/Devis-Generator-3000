import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import GlassCard from '../../GlassCard/GlassCard';
import GlassInput from '../../GlassInput/GlassInput';
import GlassButton from '../../GlassButton/GlassButton';
import { FaPlus, FaTrash } from 'react-icons/fa';
import './LegalConditions.css';

const LegalConditions = () => {
  const { quoteData, updateLegalConditions, addLegalMention, removeLegalMention, updateLegalMention } = useQuote();
  const { legalConditions } = quoteData;

  const handleAccompteChange = (field) => (e) => {
    updateLegalConditions('accompte', field, e.target.value);
  };

  const handleDechargeChange = (field) => (e) => {
    updateLegalConditions('decharge', field, e.target.value);
  };

  const handleAddMention = () => {
    addLegalMention();
  };

  const handleRemoveMention = (mentionId) => {
    removeLegalMention(mentionId);
  };

  const handleMentionChange = (mentionId, field) => (e) => {
    updateLegalMention(mentionId, field, e.target.value);
  };

  return (
    <GlassCard variant="default" className="legal-conditions">
      <h2 className="section-title">Conditions Légales</h2>
      <p className="section-subtitle">Mentions légales et conditions particulières</p>

      <div className="legal-conditions-content">
        {/* Accompte */}
        <div className="legal-template-section">
          <label className="glass-input-label">Accompte versé</label>
          <div className="template-text">
            Un acompte de <GlassInput
              type="text"
              value={legalConditions.accompte?.montant || ''}
              onChange={handleAccompteChange('montant')}
              placeholder="montant"
              className="template-input"
            /> est requis à la signature du devis. Le solde restant de <GlassInput
              type="text"
              value={legalConditions.accompte?.solde || ''}
              onChange={handleAccompteChange('solde')}
              placeholder="solde"
              className="template-input"
            /> devra être réglé avant le début de la prestation ou selon les modalités suivantes : <GlassInput
              type="text"
              value={legalConditions.accompte?.modalites || ''}
              onChange={handleAccompteChange('modalites')}
              placeholder="modalités de paiement"
              className="template-input"
            />.
          </div>
        </div>

        {/* Décharge */}
        <div className="legal-template-section">
          <label className="glass-input-label">Décharge de responsabilité après livraison</label>
          <div className="template-text">
            Le client reconnaît avoir vérifié la conformité de la prestation livrée le <GlassInput
              type="text"
              value={legalConditions.decharge?.date || ''}
              onChange={handleDechargeChange('date')}
              placeholder="date de livraison"
              className="template-input"
            />. Toute réclamation doit être formulée par écrit dans un délai de <GlassInput
              type="text"
              value={legalConditions.decharge?.delai || ''}
              onChange={handleDechargeChange('delai')}
              placeholder="délai en jours"
              className="template-input"
            /> jours suivant la livraison. Passé ce délai, la prestation sera considérée comme acceptée sans réserve.
          </div>
        </div>

        {/* Mentions légales */}
        <div className="legal-mentions-section full-width">
          <label className="glass-input-label">Mentions légales</label>
          
          <div className="legal-mentions-list">
            {legalConditions.mentionsLegales?.map((mention) => (
              <div key={mention.id} className="legal-mention-item">
                <div className="legal-mention-header">
                  <GlassInput
                    type="text"
                    value={mention.title}
                    onChange={handleMentionChange(mention.id, 'title')}
                    placeholder="Titre de la mention légale"
                    className="legal-mention-title-input"
                  />
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMention(mention.id)}
                    icon={<FaTrash />}
                    className="remove-mention-btn"
                  >
                    Supprimer
                  </GlassButton>
                </div>
                <textarea
                  className="glass-input"
                  value={mention.content}
                  onChange={handleMentionChange(mention.id, 'content')}
                  placeholder="Contenu de la mention légale..."
                  rows={3}
                />
              </div>
            ))}
          </div>

          <div className="legal-mentions-add-button">
            <GlassButton
              variant="primary"
              size="sm"
              onClick={handleAddMention}
              icon={<FaPlus />}
              iconPosition="left"
            >
              Ajouter une mention légale
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default LegalConditions;
