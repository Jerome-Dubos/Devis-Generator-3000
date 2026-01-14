import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import { calculateLineTotal, calculateTotals, formatCurrency, formatPercentage } from '../../../utils/calculations';
import { useTheme } from '../../../contexts/ThemeContext';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import './QuotePreview.css';

const QuotePreview = () => {
  const { quoteData } = useQuote();
  const { theme } = useTheme();
  const { sender, client, prestation, quoteDetails, lines, prestationDetails, legalConditions } = quoteData;
  const totals = calculateTotals(lines);

  // Formater la date en français
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="quote-preview">
      <div className="preview-header">
        <h2 className="preview-title">Aperçu du Devis</h2>
        <ThemeToggle />
      </div>

      <div className="preview-document">
        {/* En-tête */}
        <div className="preview-header-section">
          <div className="preview-logo-section">
            {sender.logoUrl ? (
              <img src={sender.logoUrl} alt="Logo" className="preview-logo-image" />
            ) : sender.name ? (
              <div className="preview-logo">
                <h1 className="preview-company-name">{sender.name}</h1>
              </div>
            ) : null}
          </div>
          <div className="preview-document-title">
            <h1 className="preview-main-title">DEVIS</h1>
            {quoteDetails.quoteNumber && (
              <p className="preview-quote-number">N° {quoteDetails.quoteNumber}</p>
            )}
          </div>
        </div>

        {/* Informations prestation */}
        {prestation.title && (
          <div className="preview-prestation-section">
            <h2 className="preview-prestation-title">{prestation.title}</h2>
            {prestation.object && (
              <p className="preview-prestation-object">
                <strong>Objet :</strong> {prestation.object}
              </p>
            )}
            {prestation.participants && (
              <p className="preview-prestation-participants">
                <strong>Participants :</strong> {prestation.participants}
              </p>
            )}
          </div>
        )}

        {/* Informations émetteur et client */}
        <div className="preview-info-section">
          <div className="preview-sender-info">
            <h3 className="preview-info-title">Émetteur</h3>
            {sender.name && <p className="preview-info-line">{sender.name}</p>}
            {(sender.address || sender.postalCode || sender.city) && (
              <p className="preview-info-line">
                {sender.address && `${sender.address}`}
                {sender.address && (sender.postalCode || sender.city) && ', '}
                {sender.postalCode && `${sender.postalCode}`}
                {sender.postalCode && sender.city && ' '}
                {sender.city && `${sender.city}`}
              </p>
            )}
            {sender.phone && <p className="preview-info-line">{sender.phone}</p>}
            {sender.email && <p className="preview-info-line">{sender.email}</p>}
            {sender.siret && <p className="preview-info-line">SIRET : {sender.siret}</p>}
          </div>

          <div className="preview-client-info">
            <h3 className="preview-info-title">Client</h3>
            {client.name && <p className="preview-info-line">{client.name}</p>}
            {(client.address || client.postalCode || client.city) && (
              <p className="preview-info-line">
                {client.address && `${client.address}`}
                {client.address && (client.postalCode || client.city) && ', '}
                {client.postalCode && `${client.postalCode}`}
                {client.postalCode && client.city && ' '}
                {client.city && `${client.city}`}
              </p>
            )}
            {client.phone && <p className="preview-info-line">{client.phone}</p>}
            {client.email && <p className="preview-info-line">{client.email}</p>}
          </div>
        </div>

        {/* Dates */}
        <div className="preview-dates-section">
          {quoteDetails.issueDate && (
            <div className="preview-date-item">
              <span className="preview-date-label">Date d'émission :</span>
              <span className="preview-date-value">{formatDate(quoteDetails.issueDate)}</span>
            </div>
          )}
          {quoteDetails.validityDate && (
            <div className="preview-date-item">
              <span className="preview-date-label">Date de validité :</span>
              <span className="preview-date-value">{formatDate(quoteDetails.validityDate)}</span>
            </div>
          )}
        </div>

        {/* Tableau des lignes */}
        {lines.length > 0 && (
          <div className="preview-lines-section">
            <table className="preview-table">
              <thead>
                <tr>
                  <th className="preview-th preview-th-description">Désignation</th>
                  <th className="preview-th preview-th-qty">Qté</th>
                  <th className="preview-th preview-th-price">PU HT</th>
                  <th className="preview-th preview-th-vat">TVA</th>
                  <th className="preview-th preview-th-total">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => {
                  const lineTotalHT = calculateLineTotal(line.quantity, line.unitPrice);
                  return (
                    <tr key={line.id} className="preview-tr">
                      <td className="preview-td preview-td-description">
                        {line.description || `Ligne ${index + 1}`}
                      </td>
                      <td className="preview-td preview-td-qty">{line.quantity || '-'}</td>
                      <td className="preview-td preview-td-price">
                        {line.unitPrice ? formatCurrency(line.unitPrice) : '-'}
                      </td>
                      <td className="preview-td preview-td-vat">
                        {line.vat ? formatPercentage(line.vat) : '-'}
                      </td>
                      <td className="preview-td preview-td-total">
                        {formatCurrency(lineTotalHT)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Totaux */}
        <div className="preview-totals-section">
          <div className="preview-totals-wrapper">
            <div className="preview-total-row">
              <span className="preview-total-label">Total HT</span>
              <span className="preview-total-value">{formatCurrency(totals.totalHT)}</span>
            </div>
            
            {/* Répartition par taux de TVA */}
            {Object.keys(totals.vatBreakdown || {}).length > 0 && (
              <div className="preview-vat-breakdown">
                {Object.entries(totals.vatBreakdown)
                  .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
                  .map(([rate, amounts]) => (
                    <div key={rate} className="preview-vat-breakdown-row">
                      <span className="preview-vat-breakdown-label">TVA {rate}%</span>
                      <div className="preview-vat-breakdown-amounts">
                        <span>HT: {formatCurrency(amounts.ht)}</span>
                        <span>TVA: {formatCurrency(amounts.vat)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            
            <div className="preview-total-row">
              <span className="preview-total-label">Total TVA</span>
              <span className="preview-total-value">{formatCurrency(totals.totalVAT)}</span>
            </div>
            <div className="preview-total-row preview-total-row--final">
              <span className="preview-total-label">Total TTC</span>
              <span className="preview-total-value preview-total-value--final">
                {formatCurrency(totals.totalTTC)}
              </span>
            </div>
          </div>
        </div>

        {/* Déroulé de la prestation */}
        {(prestationDetails.petitDejeuner || prestationDetails.plateauxRepas || 
          prestationDetails.boissons || prestationDetails.serviceLivraison) && (
          <div className="preview-prestation-details-section">
            <h3 className="preview-section-title">Déroulé de la Prestation</h3>
            
            {prestationDetails.petitDejeuner && (
              <div className="preview-prestation-detail-block">
                <h4 className="preview-prestation-detail-title">Petit déjeuner</h4>
                <p className="preview-prestation-detail-text">{prestationDetails.petitDejeuner}</p>
              </div>
            )}
            
            {prestationDetails.plateauxRepas && (
              <div className="preview-prestation-detail-block">
                <h4 className="preview-prestation-detail-title">Plateaux repas</h4>
                <p className="preview-prestation-detail-text">{prestationDetails.plateauxRepas}</p>
              </div>
            )}
            
            {prestationDetails.boissons && (
              <div className="preview-prestation-detail-block">
                <h4 className="preview-prestation-detail-title">Boissons</h4>
                <p className="preview-prestation-detail-text">{prestationDetails.boissons}</p>
              </div>
            )}
            
            {prestationDetails.serviceLivraison && (
              <div className="preview-prestation-detail-block">
                <h4 className="preview-prestation-detail-title">Service forfait livraison + rangement</h4>
                <p className="preview-prestation-detail-text">{prestationDetails.serviceLivraison}</p>
              </div>
            )}
          </div>
        )}

        {/* Conditions légales */}
        {(legalConditions.accompte || legalConditions.decharge || legalConditions.mentionsLegales) && (
          <div className="preview-legal-section">
            <h3 className="preview-section-title">Conditions Légales</h3>
            
            {legalConditions.accompte && (
              <div className="preview-note-block">
                <h4 className="preview-note-title">Accompte versé</h4>
                <p className="preview-note-text">{legalConditions.accompte}</p>
              </div>
            )}
            
            {legalConditions.decharge && (
              <div className="preview-note-block">
                <h4 className="preview-note-title">Décharge de responsabilité après livraison</h4>
                <p className="preview-note-text">{legalConditions.decharge}</p>
              </div>
            )}
            
            {legalConditions.mentionsLegales && (
              <div className="preview-note-block">
                <h4 className="preview-note-title">Mentions légales</h4>
                <p className="preview-note-text">{legalConditions.mentionsLegales}</p>
              </div>
            )}
          </div>
        )}

        {/* Pied de page */}
        <div className="preview-footer">
          <div className="preview-footer-line"></div>
          <p className="preview-footer-text">
            {sender.name && `${sender.name} - `}
            {sender.email && sender.email}
            {sender.phone && ` - ${sender.phone}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuotePreview;
