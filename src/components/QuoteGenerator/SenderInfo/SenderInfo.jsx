import React, { useRef, useState, useEffect } from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import GlassCard from '../../GlassCard/GlassCard';
import GlassInput from '../../GlassInput/GlassInput';
import GlassButton from '../../GlassButton/GlassButton';
import { FaUpload, FaTimes, FaChevronDown, FaChevronUp, FaSave, FaFolderOpen, FaTrash, FaEdit } from 'react-icons/fa';
import './SenderInfo.css';

const SenderInfo = () => {
  const { quoteData, updateSender, updateLogo, loadSenderProfiles, loadSenderProfile, saveSenderProfile, removeSenderProfile } = useQuote();
  const { sender } = quoteData;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [editingProfileId, setEditingProfileId] = useState(null);
  const fileInputRef = useRef(null);

  // Charger les profils au montage
  useEffect(() => {
    refreshProfiles();
  }, []);

  const refreshProfiles = () => {
    const allProfiles = loadSenderProfiles();
    setProfiles(allProfiles);
  };

  const handleChange = (field) => (e) => {
    updateSender(field, e.target.value);
  };

  const handleComplaintsContactChange = (field) => (e) => {
    updateSender('complaintsContact', {
      ...sender.complaintsContact,
      [field]: e.target.value,
    });
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

  const handleLoadProfile = (profileId) => {
    loadSenderProfile(profileId);
    setShowProfiles(false);
  };

  const handleSaveProfile = () => {
    if (profileName.trim()) {
      saveSenderProfile(profileName.trim(), editingProfileId);
      setShowSaveModal(false);
      setProfileName('');
      setEditingProfileId(null);
      refreshProfiles();
    }
  };

  const handleDeleteProfile = (profileId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
      removeSenderProfile(profileId);
      refreshProfiles();
    }
  };

  const handleEditProfile = (profile) => {
    setProfileName(profile.name);
    setEditingProfileId(profile.id);
    setShowSaveModal(true);
  };

  const handleNewProfile = () => {
    setProfileName('');
    setEditingProfileId(null);
    setShowSaveModal(true);
  };

  const legalForms = [
    'SARL',
    'SAS',
    'SASU',
    'SA',
    'EURL',
    'SNC',
    'SCI',
    'EI (Entrepreneur Individuel)',
    'Auto-entrepreneur',
    'Association',
    'Autre',
  ];

  return (
    <GlassCard variant="gold" className="sender-info">
      <div className="sender-info-header">
        <div>
          <h2 className="section-title">Vos Informations</h2>
          <p className="section-subtitle">Renseignez les informations de votre entreprise</p>
        </div>
        <div className="sender-info-actions">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => setShowProfiles(!showProfiles)}
            icon={<FaFolderOpen />}
            iconPosition="left"
          >
            Profils ({profiles.length})
          </GlassButton>
          <GlassButton
            variant="primary"
            size="sm"
            onClick={handleNewProfile}
            icon={<FaSave />}
            iconPosition="left"
          >
            Enregistrer ce profil
          </GlassButton>
        </div>
      </div>

      {/* Panneau de gestion des profils */}
      {showProfiles && (
        <div className="sender-profiles-panel">
          <div className="sender-profiles-header">
            <h3 className="subsection-title">Profils d'entreprise sauvegardés</h3>
            <button
              type="button"
              onClick={() => setShowProfiles(false)}
              className="profiles-close-btn"
              aria-label="Fermer"
            >
              <FaTimes />
            </button>
          </div>
          {profiles.length === 0 ? (
            <p className="profiles-empty">Aucun profil sauvegardé</p>
          ) : (
            <div className="profiles-list">
              {profiles.map((profile) => (
                <div key={profile.id} className="profile-item">
                  <div className="profile-item-info">
                    <span className="profile-name">{profile.name}</span>
                    {profile.updatedAt && (
                      <span className="profile-date">
                        Modifié le {new Date(profile.updatedAt).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                  <div className="profile-item-actions">
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoadProfile(profile.id)}
                      icon={<FaFolderOpen />}
                    >
                      Charger
                    </GlassButton>
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditProfile(profile)}
                      icon={<FaEdit />}
                    >
                      Renommer
                    </GlassButton>
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProfile(profile.id)}
                      icon={<FaTrash />}
                    >
                      Supprimer
                    </GlassButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de sauvegarde */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProfileId ? 'Renommer le profil' : 'Enregistrer un nouveau profil'}</h3>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="modal-close-btn"
                aria-label="Fermer"
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <GlassInput
                label="Nom du profil"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Ex: Mon entreprise principale"
                required
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && profileName.trim()) {
                    handleSaveProfile();
                  }
                }}
              />
            </div>
            <div className="modal-footer">
              <GlassButton
                variant="ghost"
                onClick={() => setShowSaveModal(false)}
              >
                Annuler
              </GlassButton>
              <GlassButton
                variant="primary"
                onClick={handleSaveProfile}
                disabled={!profileName.trim()}
              >
                {editingProfileId ? 'Renommer' : 'Enregistrer'}
              </GlassButton>
            </div>
          </div>
        </div>
      )}

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
          label="Raison sociale *"
          value={sender.name}
          onChange={handleChange('name')}
          placeholder="Nom de votre entreprise"
          required
        />

        <GlassInput
          label="Forme juridique"
          type="text"
          value={sender.legalForm}
          onChange={handleChange('legalForm')}
          placeholder="Ex: SARL, SAS, EI, etc."
          list="legal-forms"
        />
        <datalist id="legal-forms">
          {legalForms.map((form) => (
            <option key={form} value={form} />
          ))}
        </datalist>

        <GlassInput
          label="Nom commercial (si différent)"
          value={sender.commercialName}
          onChange={handleChange('commercialName')}
          placeholder="Nom commercial"
        />

        <GlassInput
          label="Adresse du siège social *"
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
          label="Email *"
          type="email"
          value={sender.email}
          onChange={handleChange('email')}
          placeholder="contact@exemple.fr"
          required
        />
      </div>

      {/* Informations avancées */}
      <div className="sender-advanced-section">
        <button
          type="button"
          className="sender-advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span>Informations juridiques et fiscales</span>
          {showAdvanced ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {showAdvanced && (
          <div className="sender-advanced-content">
            <div className="sender-form-grid">
              <GlassInput
                label="SIREN (9 chiffres)"
                type="text"
                value={sender.siren}
                onChange={handleChange('siren')}
                placeholder="123 456 789"
                maxLength={9}
              />

              <GlassInput
                label="SIRET complet (14 chiffres)"
                type="text"
                value={sender.siret}
                onChange={handleChange('siret')}
                placeholder="123 456 789 00012"
                maxLength={14}
              />

              <GlassInput
                label="Numéro RCS"
                value={sender.rcs}
                onChange={handleChange('rcs')}
                placeholder="Ex: RCS Paris B 123 456 789"
              />

              <GlassInput
                label="TVA intracommunautaire"
                value={sender.vatNumber}
                onChange={handleChange('vatNumber')}
                placeholder="Ex: FR12345678901"
              />
            </div>

            {/* Contact pour réclamations */}
            <div className="complaints-contact-section">
              <h3 className="subsection-title">Contact pour réclamations</h3>
              <p className="subsection-help">
                Coordonnées dédiées aux réclamations (si différentes des coordonnées principales)
              </p>
              <div className="sender-form-grid">
                <GlassInput
                  label="Nom / Service"
                  value={sender.complaintsContact?.name || ''}
                  onChange={handleComplaintsContactChange('name')}
                  placeholder="Service client ou nom du responsable"
                />

                <GlassInput
                  label="Adresse"
                  value={sender.complaintsContact?.address || ''}
                  onChange={handleComplaintsContactChange('address')}
                  placeholder="Adresse (si différente)"
                />

                <GlassInput
                  label="Email"
                  type="email"
                  value={sender.complaintsContact?.email || ''}
                  onChange={handleComplaintsContactChange('email')}
                  placeholder="reclamations@exemple.fr"
                />

                <GlassInput
                  label="Téléphone"
                  type="tel"
                  value={sender.complaintsContact?.phone || ''}
                  onChange={handleComplaintsContactChange('phone')}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default SenderInfo;
