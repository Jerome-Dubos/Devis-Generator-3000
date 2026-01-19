import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import { calculateLineTotal, calculateTotals, formatCurrency, calculateLineTotalQuantity } from '../../../utils/calculations';
import GlassCard from '../../GlassCard/GlassCard';
import GlassInput from '../../GlassInput/GlassInput';
import GlassButton from '../../GlassButton/GlassButton';
import VATSelector from '../VATSelector/VATSelector';
import { FaPlus, FaTrash } from 'react-icons/fa';
import './QuoteLines.css';

const QuoteLines = () => {
  const { quoteData, addLine, removeLine, updateLine, addChoice, removeChoice, updateChoice } = useQuote();
  const { lines } = quoteData;

  const totals = calculateTotals(lines);

  const handleLineChange = (lineId, field) => (e) => {
    if (field === 'personnel') {
      // Géré directement dans le composant personnel
      return;
    }
    const value = field === 'quantity' || field === 'unitPrice' || field === 'vat' || field === 'type'
      ? (field === 'type' ? e.target.value : parseFloat(e.target.value) || 0)
      : e.target.value;
    updateLine(lineId, field, value);
  };

  const handleChoiceChange = (lineId, choiceId, field) => (e) => {
    const value = (field === 'unitPrice' || field === 'quantity')
      ? parseFloat(e.target.value) || 0
      : e.target.value;
    updateChoice(lineId, choiceId, field, value);
  };

  const handleAddLine = () => {
    addLine();
  };

  const handleRemoveLine = (lineId) => {
    if (lines.length > 1) {
      removeLine(lineId);
    }
  };

  const handleAddChoice = (lineId) => {
    addChoice(lineId);
  };

  const handleRemoveChoice = (lineId, choiceId) => {
    removeChoice(lineId, choiceId);
  };

  return (
    <GlassCard variant="gold" className="quote-lines">
      <div className="quote-lines-header">
        <div>
          <h2 className="section-title">Lignes de Devis</h2>
          <p className="section-subtitle">Ajoutez les prestations et services</p>
        </div>
      </div>

      <div className="quote-lines-container">
        <div className="quote-lines-list">
        {lines.map((line, index) => {
          // Rétrocompatibilité : si type n'existe pas, c'est une ligne normale
          const lineType = line.type || 'normal';
          // S'assurer que choices existe pour éviter les erreurs
          const lineChoices = line.choices || [];
          const linePersonnel = line.personnel || {};
          const lineTotalHT = calculateLineTotal(line.quantity, line.unitPrice, lineChoices, linePersonnel);
          const lineTotalQuantity = lineType === 'choice' ? calculateLineTotalQuantity(lineChoices) : (line.quantity || 0);

          return (
            <div key={line.id} className="quote-line">
              <div className="quote-line-header">
                <span className="line-number">Ligne {index + 1}</span>
                {lines.length > 1 && (
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLine(line.id)}
                    icon={<FaTrash />}
                    className="remove-line-btn"
                  >
                    Supprimer
                  </GlassButton>
                )}
              </div>

              <div className="quote-line-type-selector">
                <label className="glass-input-label">Type de ligne</label>
                <select
                  className="glass-input"
                  value={lineType}
                  onChange={handleLineChange(line.id, 'type')}
                >
                  <option value="normal">Ligne normale (quantité + prix)</option>
                  <option value="choice">Ligne avec choix (plusieurs options)</option>
                  <option value="table">Déco dressage (par table)</option>
                  <option value="personnel">Personnel</option>
                </select>
              </div>

              <div className="quote-line-grid">
                <div className="quote-line-description">
                  <GlassInput
                    label="Désignation"
                    value={line.description}
                    onChange={handleLineChange(line.id, 'description')}
                    placeholder={
                      lineType === 'choice' ? "Ex: Entrée" :
                      lineType === 'table' ? "Déco dressage" :
                      lineType === 'personnel' ? "Personnel" :
                      "Désignation du produit/service"
                    }
                    required
                  />
                </div>

                {lineType === 'normal' || lineType === 'table' ? (
                  <>
                    <GlassInput
                      label="Quantité"
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.quantity || ''}
                      onChange={handleLineChange(line.id, 'quantity')}
                      placeholder={lineType === 'table' ? "Nombre de tables" : "1"}
                      required
                    />

                    <GlassInput
                      label="PU HT (€)"
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.unitPrice || ''}
                      onChange={handleLineChange(line.id, 'unitPrice')}
                      placeholder={lineType === 'table' ? "150.00" : "0.00"}
                      required
                    />
                  </>
                ) : lineType === 'choice' ? (
                  <>
                    <div className="quote-line-total-quantity">
                      <label className="glass-input-label">Quantité totale</label>
                      <div className="line-total-quantity-display">
                        {lineTotalQuantity}
                      </div>
                    </div>
                    <div className="quote-line-placeholder"></div>
                  </>
                ) : lineType === 'personnel' ? (
                  <>
                    <div className="quote-line-placeholder"></div>
                    <div className="quote-line-placeholder"></div>
                  </>
                ) : (
                  <>
                    <div className="quote-line-placeholder"></div>
                    <div className="quote-line-placeholder"></div>
                  </>
                )}

                <VATSelector
                  label="TVA (%)"
                  value={line.vat}
                  onChange={handleLineChange(line.id, 'vat')}
                  required
                />

                <div className="quote-line-total">
                  <label className="glass-input-label">Total HT</label>
                  <div className="line-total-display">
                    {formatCurrency(lineTotalHT)}
                  </div>
                  {lineType === 'choice' && (
                    <div className="line-total-ttc-display" style={{ marginTop: '4px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      TTC: {formatCurrency(lineTotalHT * (1 + (line.vat || 0) / 100))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description détaillée pour les lignes normales et table */}
              {(lineType === 'normal' || lineType === 'table') && (
                <div className="quote-line-long-description">
                  <label htmlFor={`long-desc-${line.id}`} className="glass-input-label">
                    Description détaillée {lineType === 'table' ? '(nappe, serviettes, photophore, dragées, déco)' : '(optionnel)'}
                  </label>
                  <textarea
                    id={`long-desc-${line.id}`}
                    className="glass-input"
                    value={line.longDescription || ''}
                    onChange={handleLineChange(line.id, 'longDescription')}
                    placeholder={lineType === 'table' ? "Nappe, serviettes, photophore, dragées, déco" : "Description détaillée du produit/service..."}
                    rows={3}
                  />
                </div>
              )}

              {/* Section personnel pour les lignes de type 'personnel' */}
              {lineType === 'personnel' && (
                <div className="quote-line-personnel">
                  <div className="quote-line-personnel-header">
                    <label className="glass-input-label">Personnel</label>
                  </div>
                  <div className="quote-line-personnel-items">
                    {[
                      { key: 'serveurs', label: 'Serveurs', defaultQuantity: 4 },
                      { key: 'cuisiniers', label: 'Cuisiniers', defaultQuantity: 4 },
                      { key: 'barman', label: 'Barman', defaultQuantity: 1 },
                    ].map((item) => {
                      const personnelData = line.personnel || {};
                      const quantity = personnelData[item.key]?.quantity ?? item.defaultQuantity;
                      const unitPrice = personnelData[item.key]?.unitPrice || 0;
                      const totalHT = quantity * unitPrice;
                      
                      return (
                        <div key={item.key} className="quote-line-personnel-item">
                          <GlassInput
                            label={item.label}
                            type="number"
                            min="0"
                            step="1"
                            value={quantity}
                            onChange={(e) => {
                              const newQuantity = parseFloat(e.target.value) || 0;
                              updateLine(line.id, 'personnel', {
                                ...personnelData,
                                [item.key]: {
                                  ...personnelData[item.key],
                                  quantity: newQuantity,
                                  unitPrice: personnelData[item.key]?.unitPrice || 0,
                                },
                              });
                            }}
                            placeholder={item.defaultQuantity.toString()}
                            required
                          />
                          <GlassInput
                            label="PU HT (€)"
                            type="number"
                            min="0"
                            step="0.01"
                            value={unitPrice}
                            onChange={(e) => {
                              const newUnitPrice = parseFloat(e.target.value) || 0;
                              updateLine(line.id, 'personnel', {
                                ...personnelData,
                                [item.key]: {
                                  ...personnelData[item.key],
                                  quantity: quantity,
                                  unitPrice: newUnitPrice,
                                },
                              });
                            }}
                            placeholder="0.00"
                            required
                          />
                          <div className="quote-line-personnel-total">
                            <label className="glass-input-label">Total HT</label>
                            <div className="personnel-total-display">
                              {formatCurrency(totalHT)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section des choix pour les lignes de type 'choice' */}
              {lineType === 'choice' && (
                <div className="quote-line-choices">
                  <div className="quote-line-choices-header">
                    <label className="glass-input-label">Choix disponibles</label>
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddChoice(line.id)}
                      icon={<FaPlus />}
                      iconPosition="left"
                    >
                      Ajouter un choix
                    </GlassButton>
                  </div>
                  {lineChoices.map((choice, choiceIndex) => {
                    const choiceTotalHT = (parseFloat(choice.quantity) || 0) * (parseFloat(choice.unitPrice) || 0);
                    return (
                      <div key={choice.id} className="quote-line-choice">
                        <GlassInput
                          label={`Choix ${choiceIndex + 1}`}
                          value={choice.description}
                          onChange={handleChoiceChange(line.id, choice.id, 'description')}
                          placeholder="Description du choix"
                          required
                        />
                        <GlassInput
                          label="Quantité"
                          type="number"
                          min="0"
                          step="0.01"
                          value={choice.quantity || ''}
                          onChange={handleChoiceChange(line.id, choice.id, 'quantity')}
                          placeholder="1"
                          required
                        />
                        <GlassInput
                          label="PU HT (€)"
                          type="number"
                          min="0"
                          step="0.01"
                          value={choice.unitPrice || ''}
                          onChange={handleChoiceChange(line.id, choice.id, 'unitPrice')}
                          placeholder="0.00"
                          required
                        />
                        <div className="quote-line-choice-total">
                          <label className="glass-input-label">Total HT</label>
                          <div className="choice-total-display">
                            {formatCurrency(choiceTotalHT)}
                          </div>
                        </div>
                        {lineChoices.length > 1 && (
                          <GlassButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveChoice(line.id, choice.id)}
                            icon={<FaTrash />}
                            className="remove-choice-btn"
                          >
                            Supprimer
                          </GlassButton>
                        )}
                      </div>
                    );
                  })}
                  {lineChoices.length === 0 && (
                    <p className="quote-line-choices-empty">
                      Aucun choix défini. Cliquez sur "Ajouter un choix" pour commencer.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        </div>
        
        {/* Bouton flottant pour ajouter une ligne */}
        <div className="quote-lines-add-button-sticky">
          <GlassButton
            variant="primary"
            size="sm"
            onClick={handleAddLine}
            icon={<FaPlus />}
            iconPosition="left"
          >
            Ajouter une ligne
          </GlassButton>
        </div>
      </div>

      {/* Totaux */}
      <div className="quote-totals">
        <div className="total-row">
          <span className="total-label">Total HT</span>
          <span className="total-value">{formatCurrency(totals.totalHT)}</span>
        </div>
        
        {/* Répartition par taux de TVA */}
        {Object.keys(totals.vatBreakdown || {}).length > 0 && (
          <div className="vat-breakdown">
            {Object.entries(totals.vatBreakdown)
              .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
              .map(([rate, amounts]) => (
                <div key={rate} className="vat-breakdown-row">
                  <span className="vat-breakdown-label">TVA {rate}%</span>
                  <div className="vat-breakdown-amounts">
                    <span className="vat-breakdown-ht">
                      HT: {formatCurrency(amounts.ht)}
                    </span>
                    <span className="vat-breakdown-vat">
                      TVA: {formatCurrency(amounts.vat)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        <div className="total-row">
          <span className="total-label">Total TVA</span>
          <span className="total-value">{formatCurrency(totals.totalVAT)}</span>
        </div>
        <div className="total-row total-row--final">
          <span className="total-label">Total TTC</span>
          <span className="total-value total-value--final">
            {formatCurrency(totals.totalTTC)}
          </span>
        </div>
      </div>
    </GlassCard>
  );
};

export default QuoteLines;
