import React, { useEffect, useState, useRef } from 'react';
import { QuoteProvider, useQuote } from '../../contexts/QuoteContext';
import SenderInfo from '../../components/QuoteGenerator/SenderInfo/SenderInfo';
import ClientInfo from '../../components/QuoteGenerator/ClientInfo/ClientInfo';
import PrestationInfo from '../../components/QuoteGenerator/PrestationInfo/PrestationInfo';
import QuoteDetails from '../../components/QuoteGenerator/QuoteDetails/QuoteDetails';
import QuoteLines from '../../components/QuoteGenerator/QuoteLines/QuoteLines';
import PrestationDetails from '../../components/QuoteGenerator/PrestationDetails/PrestationDetails';
import Guarantees from '../../components/QuoteGenerator/Guarantees/Guarantees';
import LegalConditions from '../../components/QuoteGenerator/LegalConditions/LegalConditions';
import QuotePreview from '../../components/QuoteGenerator/QuotePreview/QuotePreview';
import GenerateButton from '../../components/QuoteGenerator/GenerateButton/GenerateButton';
import './Quote.css';

const QuoteContent = () => {
  const { initializeQuoteNumber, addLine, quoteData } = useQuote();
  const [leftWidth, setLeftWidth] = useState(50); // Pourcentage initial
  const [isResizing, setIsResizing] = useState(false);
  const gridRef = useRef(null);

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

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !gridRef.current) return;

      const gridRect = gridRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - gridRect.left) / gridRect.width) * 100;
      
      // Limiter entre 30% et 70%
      const clampedWidth = Math.max(30, Math.min(70, newLeftWidth));
      setLeftWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <div className="quote-page">
      <div className="quote-container">
        <header className="quote-header">
          <h1 className="quote-title">Générateur de Devis</h1>
          <p className="quote-subtitle">Créez un devis professionnel en quelques clics</p>
        </header>

        <div 
          className="quote-form-grid" 
          ref={gridRef}
          style={{ 
            gridTemplateColumns: `${leftWidth}% auto ${100 - leftWidth}%`
          }}
        >
          {/* Colonne gauche - Formulaire */}
          <div className="quote-form-column">
            <SenderInfo />
            <ClientInfo />
            <PrestationInfo />
            <QuoteDetails />
            <QuoteLines />
            <PrestationDetails />
            <Guarantees />
            <LegalConditions />
            <div className="generate-button-wrapper">
              <GenerateButton />
            </div>
          </div>

          {/* Séparateur resizable */}
          <div 
            className="resize-handle"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
          />

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
