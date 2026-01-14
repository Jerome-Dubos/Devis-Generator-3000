import React, { useState } from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { generatePDF } from '../../../utils/pdfGenerator';
import GlassButton from '../../GlassButton/GlassButton';
import GlassInput from '../../GlassInput/GlassInput';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';
import './GenerateButton.css';

const GenerateButton = () => {
  const { quoteData } = useQuote();
  const { theme } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [pdfTheme, setPdfTheme] = useState(theme); // Thème du PDF (peut être différent de l'interface)

  const validateQuote = () => {
    const { sender, client, lines } = quoteData;

    // Vérifier les champs obligatoires de l'émetteur
    if (!sender.name || !sender.email) {
      return 'Veuillez remplir au moins le nom et l\'email de l\'émetteur.';
    }

    // Vérifier les champs obligatoires du client
    if (!client.name) {
      return 'Veuillez remplir au moins le nom du client.';
    }

    // Vérifier qu'il y a au moins une ligne avec une description
    const hasValidLine = lines.some(
      (line) => line.description && line.quantity > 0 && line.unitPrice > 0
    );

    if (!hasValidLine) {
      return 'Veuillez ajouter au moins une ligne de devis avec description, quantité et prix.';
    }

    return null;
  };

  const handleGenerate = async () => {
    setError(null);
    
    // Valider les données
    const validationError = validateQuote();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsGenerating(true);

    try {
      // Simuler un petit délai pour l'animation
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Générer le PDF avec le thème choisi
      await generatePDF(quoteData, pdfTheme);
      
      // Réinitialiser après un court délai
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    } catch (err) {
      console.error('Erreur lors de la génération du PDF:', err);
      setError('Une erreur est survenue lors de la génération du PDF.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="generate-button-container">
      {error && (
        <div className="generate-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
        </div>
      )}
      
      <div className="pdf-theme-selector">
        <label className="pdf-theme-label">Thème du PDF :</label>
        <div className="pdf-theme-radio-group">
          <label className="pdf-theme-radio">
            <input
              type="radio"
              name="pdfTheme"
              value="light"
              checked={pdfTheme === 'light'}
              onChange={(e) => setPdfTheme(e.target.value)}
            />
            <span>Clair</span>
          </label>
          <label className="pdf-theme-radio">
            <input
              type="radio"
              name="pdfTheme"
              value="dark"
              checked={pdfTheme === 'dark'}
              onChange={(e) => setPdfTheme(e.target.value)}
            />
            <span>Sombre</span>
          </label>
        </div>
        <p className="pdf-theme-hint">Le thème du PDF est indépendant de celui de l'interface</p>
      </div>

      <GlassButton
        variant="primary"
        size="lg"
        onClick={handleGenerate}
        disabled={isGenerating}
        icon={isGenerating ? <FaSpinner className="spinning" /> : <FaFilePdf />}
        iconPosition="left"
        className="generate-pdf-button"
      >
        {isGenerating ? 'Génération en cours...' : 'Générer le PDF'}
      </GlassButton>
    </div>
  );
};

export default GenerateButton;
