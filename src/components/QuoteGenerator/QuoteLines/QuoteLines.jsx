import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import { calculateLineTotal, calculateTotals, formatCurrency } from '../../../utils/calculations';
import GlassCard from '../../GlassCard/GlassCard';
import GlassInput from '../../GlassInput/GlassInput';
import GlassButton from '../../GlassButton/GlassButton';
import { FaPlus, FaTrash } from 'react-icons/fa';
import './QuoteLines.css';

const QuoteLines = () => {
  const { quoteData, addLine, removeLine, updateLine } = useQuote();
  const { lines } = quoteData;

  const totals = calculateTotals(lines);

  const handleLineChange = (lineId, field) => (e) => {
    const value = field === 'quantity' || field === 'unitPrice' || field === 'vat'
      ? parseFloat(e.target.value) || 0
      : e.target.value;
    updateLine(lineId, field, value);
  };

  const handleAddLine = () => {
    addLine();
  };

  const handleRemoveLine = (lineId) => {
    if (lines.length > 1) {
      removeLine(lineId);
    }
  };

  return (
    <GlassCard variant="gold" className="quote-lines">
      <div className="quote-lines-header">
        <div>
          <h2 className="section-title">Lignes de Devis</h2>
          <p className="section-subtitle">Ajoutez les prestations et services</p>
        </div>
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

      <div className="quote-lines-list">
        {lines.map((line, index) => {
          const lineTotalHT = calculateLineTotal(line.quantity, line.unitPrice);

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

              <div className="quote-line-grid">
                <div className="quote-line-description">
                  <GlassInput
                    label="Désignation"
                    value={line.description}
                    onChange={handleLineChange(line.id, 'description')}
                    placeholder="Désignation du produit/service"
                    required
                  />
                </div>

                <GlassInput
                  label="Quantité"
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.quantity}
                  onChange={handleLineChange(line.id, 'quantity')}
                  placeholder="1"
                  required
                />

                <GlassInput
                  label="PU HT (€)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.unitPrice}
                  onChange={handleLineChange(line.id, 'unitPrice')}
                  placeholder="0.00"
                  required
                />

                <GlassInput
                  label="TVA (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={line.vat}
                  onChange={handleLineChange(line.id, 'vat')}
                  placeholder="20"
                  required
                />

                <div className="quote-line-total">
                  <label className="glass-input-label">Total HT</label>
                  <div className="line-total-display">
                    {formatCurrency(lineTotalHT)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
