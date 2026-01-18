import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import { calculateLineTotal, calculateTotals, formatCurrency, formatPercentage } from '../../../utils/calculations';
import { useTheme } from '../../../contexts/ThemeContext';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import './QuotePreview.css';

const QuotePreview = () => {
  const { quoteData } = useQuote();
  const { theme } = useTheme();
  const { sender, client, prestation, quoteDetails, lines, prestationDetails, legalConditions, guarantees, taxSettings } = quoteData;
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
            {prestation.startDate && (
              <p className="preview-prestation-info">
                <strong>Date de début :</strong> {formatDate(prestation.startDate)}
              </p>
            )}
            {prestation.estimatedDuration && (
              <p className="preview-prestation-info">
                <strong>Durée estimée :</strong> {prestation.estimatedDuration}
              </p>
            )}
            {prestation.deliveryConditions && (
              <p className="preview-prestation-info">
                <strong>Conditions de livraison :</strong> {prestation.deliveryConditions}
              </p>
            )}
          </div>
        )}

        {/* Informations émetteur et client */}
        <div className="preview-info-section">
          <div className="preview-sender-info">
            <h3 className="preview-info-title">Émetteur</h3>
            {sender.name && <p className="preview-info-line">{sender.name}</p>}
            {sender.legalForm && <p className="preview-info-line">{sender.legalForm}</p>}
            {sender.commercialName && <p className="preview-info-line">Nom commercial : {sender.commercialName}</p>}
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
            {sender.siren && <p className="preview-info-line">SIREN : {sender.siren}</p>}
            {sender.siret && <p className="preview-info-line">SIRET : {sender.siret}</p>}
            {sender.rcs && <p className="preview-info-line">RCS : {sender.rcs}</p>}
            {sender.vatNumber && <p className="preview-info-line">TVA intracommunautaire : {sender.vatNumber}</p>}
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

        {/* Dates et informations */}
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
          {quoteDetails.isFree !== undefined && (
            <div className="preview-date-item">
              <span className="preview-date-label">Devis :</span>
              <span className="preview-date-value">{quoteDetails.isFree !== false ? 'Gratuit' : 'Payant'}</span>
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
                  const lineType = line.type || 'normal';
                  const lineTotalHT = calculateLineTotal(line.quantity, line.unitPrice, line.choices);
                  const hasChoices = lineType === 'choice' && line.choices && line.choices.length > 0;
                  
                  return (
                    <React.Fragment key={line.id}>
                      <tr className="preview-tr">
                        <td className="preview-td preview-td-description">
                          <div>
                            {line.description || `Ligne ${index + 1}`}
                            {lineType === 'normal' && line.longDescription && (
                              <div className="preview-td-description-detail">
                                {line.longDescription}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="preview-td preview-td-qty">
                          {lineType === 'choice' ? '-' : (line.quantity || '-')}
                        </td>
                        <td className="preview-td preview-td-price">
                          {lineType === 'choice' ? '-' : (line.unitPrice ? formatCurrency(line.unitPrice) : '-')}
                        </td>
                        <td className="preview-td preview-td-vat">
                          {line.vat ? formatPercentage(line.vat) : '-'}
                        </td>
                        <td className="preview-td preview-td-total">
                          {formatCurrency(lineTotalHT)}
                        </td>
                      </tr>
                      {hasChoices && line.choices.map((choice) => {
                        const choiceTotalHT = calculateLineTotal(1, choice.unitPrice);
                        return (
                          <tr key={choice.id} className="preview-tr preview-tr-choice">
                            <td className="preview-td preview-td-description">
                              <span style={{ paddingLeft: '20px' }}>→ {choice.description}</span>
                            </td>
                            <td className="preview-td preview-td-qty">-</td>
                            <td className="preview-td preview-td-price">
                              {choice.unitPrice ? formatCurrency(choice.unitPrice) : '-'}
                            </td>
                            <td className="preview-td preview-td-vat">-</td>
                            <td className="preview-td preview-td-total">
                              {formatCurrency(choiceTotalHT)}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
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
        {prestationDetails && prestationDetails.length > 0 && prestationDetails.some(section => section.content) && (
          <div className="preview-prestation-details-section">
            <h3 className="preview-section-title">Déroulé de la Prestation</h3>
            
            {prestationDetails.map((section) => {
              if (!section.content) return null;
              return (
                <div key={section.id} className="preview-prestation-detail-block">
                  <h4 className="preview-prestation-detail-title">{section.label}</h4>
                  <p className="preview-prestation-detail-text">{section.content}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Conditions de paiement */}
        {quoteDetails.paymentConditions && (
          <div className="preview-note-block">
            <h4 className="preview-note-title">Conditions de paiement</h4>
            <p className="preview-note-text">{quoteDetails.paymentConditions}</p>
          </div>
        )}

        {/* Garanties */}
        {guarantees && ((guarantees.legalWarranty !== false || guarantees.hiddenDefectsWarranty !== false || guarantees.warrantyDuration || guarantees.afterSalesService)) && (
          <div className="preview-note-block">
            <h4 className="preview-note-title">Garanties et Service Après-Vente</h4>
            <div className="preview-note-text">
              {guarantees.legalWarranty !== false && (
                <p>✓ Garantie légale de conformité (obligatoire)</p>
              )}
              {guarantees.hiddenDefectsWarranty !== false && (
                <p>✓ Garantie des vices cachés</p>
              )}
              {guarantees.warrantyDuration && (
                <p><strong>Durée de garantie :</strong> {guarantees.warrantyDuration}</p>
              )}
              {guarantees.afterSalesService && (
                <p><strong>Service après-vente :</strong> {guarantees.afterSalesService}</p>
              )}
            </div>
          </div>
        )}

        {/* Contact réclamations */}
        {sender.complaintsContact && (sender.complaintsContact.name || sender.complaintsContact.email || sender.complaintsContact.phone || sender.complaintsContact.address) && (
          <div className="preview-note-block">
            <h4 className="preview-note-title">Contact pour réclamations</h4>
            <div className="preview-note-text">
              {sender.complaintsContact.name && <p><strong>{sender.complaintsContact.name}</strong></p>}
              {sender.complaintsContact.address && <p>{sender.complaintsContact.address}</p>}
              {sender.complaintsContact.email && <p>Email : {sender.complaintsContact.email}</p>}
              {sender.complaintsContact.phone && <p>Téléphone : {sender.complaintsContact.phone}</p>}
            </div>
          </div>
        )}

        {/* Conditions légales */}
        {((legalConditions.accompte && (legalConditions.accompte.montant || legalConditions.accompte.solde || legalConditions.accompte.modalites)) ||
          (legalConditions.decharge && (legalConditions.decharge.date || legalConditions.decharge.delai)) ||
          (legalConditions.mentionsLegales && legalConditions.mentionsLegales.length > 0)) && (
          <div className="preview-legal-section">
            <h3 className="preview-section-title">Conditions Légales</h3>
            
            {legalConditions.accompte && (legalConditions.accompte.montant || legalConditions.accompte.solde || legalConditions.accompte.modalites) && (
              <div className="preview-note-block">
                <h4 className="preview-note-title">Accompte versé</h4>
                <p className="preview-note-text">
                  Un acompte de {legalConditions.accompte.montant || '[montant]'} est requis à la signature du devis. Le solde restant de {legalConditions.accompte.solde || '[solde]'} devra être réglé avant le début de la prestation ou selon les modalités suivantes : {legalConditions.accompte.modalites || '[modalités de paiement]'}.
                </p>
              </div>
            )}
            
            {legalConditions.decharge && (legalConditions.decharge.date || legalConditions.decharge.delai) && (
              <div className="preview-note-block">
                <h4 className="preview-note-title">Décharge de responsabilité après livraison</h4>
                <p className="preview-note-text">
                  Le client reconnaît avoir vérifié la conformité de la prestation livrée le {legalConditions.decharge.date || '[date de livraison]'}. Toute réclamation doit être formulée par écrit dans un délai de {legalConditions.decharge.delai || '[délai en jours]'} jours suivant la livraison. Passé ce délai, la prestation sera considérée comme acceptée sans réserve.
                </p>
              </div>
            )}
            
            {legalConditions.mentionsLegales && legalConditions.mentionsLegales.length > 0 && legalConditions.mentionsLegales.some(m => m.content) && (
              <div className="preview-note-block">
                <h4 className="preview-note-title">Mentions légales</h4>
                {legalConditions.mentionsLegales.map((mention) => {
                  if (!mention.content) return null;
                  return (
                    <div key={mention.id} className="preview-mention-item">
                      {mention.title && <h5 className="preview-mention-subtitle">{mention.title}</h5>}
                      <p className="preview-note-text">{mention.content}</p>
                    </div>
                  );
                })}
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
