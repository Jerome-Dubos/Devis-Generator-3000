import React, { useState } from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import GlassCard from '../../GlassCard/GlassCard';
import GlassButton from '../../GlassButton/GlassButton';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import './PrestationDetails.css';

const EditableLabel = ({ value, onChange, sectionId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleClick = () => {
    setIsEditing(true);
    setTempValue(value);
  };

  const handleBlur = () => {
    if (tempValue.trim()) {
      onChange(sectionId, 'label', tempValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        className="editable-label-input"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
  }

  return (
    <div className="editable-label-wrapper" onClick={handleClick}>
      <span className="glass-input-label editable-label">{value}</span>
      <FaEdit className="editable-label-icon" />
    </div>
  );
};

const PrestationDetails = () => {
  const { quoteData, addPrestationDetail, removePrestationDetail, updatePrestationDetail } = useQuote();
  const { prestationDetails } = quoteData;

  const handleChange = (sectionId, field) => (e) => {
    updatePrestationDetail(sectionId, field, e.target.value);
  };

  const handleAddSection = () => {
    addPrestationDetail();
  };

  const handleRemoveSection = (sectionId) => {
    removePrestationDetail(sectionId);
  };

  return (
    <GlassCard variant="default" className="prestation-details">
      <h2 className="section-title">Déroulé de la Prestation</h2>
      <p className="section-subtitle">Détaillez les éléments de la prestation</p>

      <div className="prestation-details-list">
        {prestationDetails.map((section, index) => (
          <div key={section.id} className="prestation-detail-item">
            <div className="prestation-detail-header">
              <EditableLabel
                value={section.label}
                onChange={updatePrestationDetail}
                sectionId={section.id}
              />
              {prestationDetails.length > 1 && (
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSection(section.id)}
                  icon={<FaTrash />}
                  className="remove-section-btn"
                >
                  Supprimer
                </GlassButton>
              )}
            </div>
            <textarea
              className="glass-input"
              value={section.content}
              onChange={handleChange(section.id, 'content')}
              placeholder="Détails de cette section..."
              rows={4}
            />
          </div>
        ))}
      </div>

      <div className="prestation-details-add-button">
        <GlassButton
          variant="primary"
          size="sm"
          onClick={handleAddSection}
          icon={<FaPlus />}
          iconPosition="left"
        >
          Ajouter une section
        </GlassButton>
      </div>
    </GlassCard>
  );
};

export default PrestationDetails;
