import React, { useEffect } from 'react';
import { QuoteProvider, useQuote } from '../../contexts/QuoteContext';
import SenderInfo from '../../components/QuoteGenerator/SenderInfo/SenderInfo';
import ClientInfo from '../../components/QuoteGenerator/ClientInfo/ClientInfo';
import PrestationInfo from '../../components/QuoteGenerator/PrestationInfo/PrestationInfo';
import QuoteDetails from '../../components/QuoteGenerator/QuoteDetails/QuoteDetails';
import QuoteLines from '../../components/QuoteGenerator/QuoteLines/QuoteLines';
import PrestationDetails from '../../components/QuoteGenerator/PrestationDetails/PrestationDetails';
import LegalConditions from '../../components/QuoteGenerator/LegalConditions/LegalConditions';
import QuotePreview from '../../components/QuoteGenerator/QuotePreview/QuotePreview';
import GenerateButton from '../../components/QuoteGenerator/GenerateButton/GenerateButton';
import './Quote.css';

const QuoteContent = () => {
  const { initializeQuoteNumber, addLine, quoteData } = useQuote();

  useEffect(() => {
    // Initialiser le numéro de devis
    initializeQuoteNumber();
  }, [initializeQuoteNumber]);

  useEffect(() => {
    // Ajouter une première ligne si aucune ligne n'existe
    if (quoteData.lines.length === 0) {
      addLine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Exécuter une seule fois au montage

  return (
    <div className="quote-page">
      <div className="quote-container">
        <header className="quote-header">
          <h1 className="quote-title">Générateur de Devis</h1>
          <p className="quote-subtitle">Créez un devis professionnel en quelques clics</p>
        </header>

        <div className="quote-form-grid">
          {/* Colonne gauche - Formulaire */}
          <div className="quote-form-column">
            <SenderInfo />
            <ClientInfo />
            <PrestationInfo />
            <QuoteDetails />
            <QuoteLines />
            <PrestationDetails />
            <LegalConditions />
            <div className="generate-button-wrapper">
              <GenerateButton />
            </div>
          </div>

          {/* Colonne droite - Aperçu */}
          <div className="quote-preview-column">
            <QuotePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

const Quote = () => {
  return (
    <QuoteProvider>
      <QuoteContent />
    </QuoteProvider>
  );
};

export default Quote;
