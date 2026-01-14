import React, { useRef } from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import GlassCard from '../../GlassCard/GlassCard';
import GlassInput from '../../GlassInput/GlassInput';
import GlassButton from '../../GlassButton/GlassButton';
import { FaUpload, FaTimes } from 'react-icons/fa';
import './SenderInfo.css';

const SenderInfo = () => {
  const { quoteData, updateSender, updateLogo } = useQuote();
  const { sender } = quoteData;
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    updateSender(field, e.target.value);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      updateLogo(file);
    }
  };

  const handleRemoveLogo = () => {
    updateLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <GlassCard variant="gold" className="sender-info">
      <h2 className="section-title">Vos Informations</h2>
      <p className="section-subtitle">Renseignez les informations de votre entreprise</p>

      {/* Upload Logo */}
      <div className="logo-upload-section">
        <label className="logo-upload-label">Logo de l'entreprise</label>
        <div className="logo-upload-container">
          {sender.logoUrl ? (
            <div className="logo-preview">
              <img src={sender.logoUrl} alt="Logo" className="logo-preview-image" />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="logo-remove-btn"
                aria-label="Supprimer le logo"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <div className="logo-upload-placeholder">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="logo-upload-input"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="logo-upload-label-btn">
                <FaUpload />
                <span>Choisir un logo</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="sender-form-grid">
        <GlassInput
          label="Nom / Raison sociale"
          value={sender.name}
          onChange={handleChange('name')}
          placeholder="Votre nom ou raison sociale"
          required
        />

        <GlassInput
          label="Adresse"
          value={sender.address}
          onChange={handleChange('address')}
          placeholder="Numéro et nom de rue"
        />

        <GlassInput
          label="Code postal"
          type="text"
          value={sender.postalCode}
          onChange={handleChange('postalCode')}
          placeholder="75001"
        />

        <GlassInput
          label="Ville"
          value={sender.city}
          onChange={handleChange('city')}
          placeholder="Paris"
        />

        <GlassInput
          label="Téléphone"
          type="tel"
          value={sender.phone}
          onChange={handleChange('phone')}
          placeholder="+33 1 23 45 67 89"
        />

        <GlassInput
          label="Email"
          type="email"
          value={sender.email}
          onChange={handleChange('email')}
          placeholder="contact@exemple.fr"
          required
        />

        <GlassInput
          label="SIRET (optionnel)"
          type="text"
          value={sender.siret}
          onChange={handleChange('siret')}
          placeholder="123 456 789 00012"
        />
      </div>
    </GlassCard>
  );
};

export default SenderInfo;
