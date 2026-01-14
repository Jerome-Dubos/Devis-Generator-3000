import React, { createContext, useContext, useState, useCallback } from 'react';

const QuoteContext = createContext();

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};

// Structure initiale des données
const initialQuoteData = {
  // Informations émetteur
  sender: {
    name: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
    siret: '',
    logo: null,
    logoUrl: null, // URL de l'image pour affichage
  },
  // Informations client
  client: {
    name: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
  },
  // Informations prestation
  prestation: {
    title: '',
    object: '',
    participants: '',
  },
  // Détails du devis
  quoteDetails: {
    quoteNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    validityDate: '',
  },
  // Lignes de devis
  lines: [],
  // Déroulé de la prestation
  prestationDetails: {
    petitDejeuner: '',
    plateauxRepas: '',
    boissons: '',
    serviceLivraison: '',
  },
  // Conditions légales
  legalConditions: {
    accompte: '',
    decharge: '',
    mentionsLegales: '',
  },
};

export const QuoteProvider = ({ children }) => {
  const [quoteData, setQuoteData] = useState(initialQuoteData);

  // Mettre à jour les informations de l'émetteur
  const updateSender = useCallback((field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      sender: {
        ...prev.sender,
        [field]: value,
      },
    }));
  }, []);

  // Mettre à jour le logo
  const updateLogo = useCallback((file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuoteData((prev) => ({
          ...prev,
          sender: {
            ...prev.sender,
            logo: file,
            logoUrl: reader.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setQuoteData((prev) => ({
        ...prev,
        sender: {
          ...prev.sender,
          logo: null,
          logoUrl: null,
        },
      }));
    }
  }, []);

  // Mettre à jour les informations de la prestation
  const updatePrestation = useCallback((field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      prestation: {
        ...prev.prestation,
        [field]: value,
      },
    }));
  }, []);

  // Mettre à jour le déroulé de la prestation
  const updatePrestationDetails = useCallback((field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      prestationDetails: {
        ...prev.prestationDetails,
        [field]: value,
      },
    }));
  }, []);

  // Mettre à jour les conditions légales
  const updateLegalConditions = useCallback((field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      legalConditions: {
        ...prev.legalConditions,
        [field]: value,
      },
    }));
  }, []);

  // Mettre à jour les informations du client
  const updateClient = useCallback((field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value,
      },
    }));
  }, []);

  // Mettre à jour les détails du devis
  const updateQuoteDetails = useCallback((field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      quoteDetails: {
        ...prev.quoteDetails,
        [field]: value,
      },
    }));
  }, []);

  // Ajouter une ligne de devis
  const addLine = useCallback(() => {
    // Générer un ID unique en combinant timestamp et random
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newLine = {
      id: uniqueId,
      description: '',
      quantity: 1,
      unitPrice: 0,
      vat: 20, // TVA par défaut à 20%
    };
    setQuoteData((prev) => ({
      ...prev,
      lines: [...prev.lines, newLine],
    }));
    return newLine.id;
  }, []);

  // Supprimer une ligne de devis
  const removeLine = useCallback((lineId) => {
    setQuoteData((prev) => ({
      ...prev,
      lines: prev.lines.filter((line) => line.id !== lineId),
    }));
  }, []);

  // Mettre à jour une ligne de devis
  const updateLine = useCallback((lineId, field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      lines: prev.lines.map((line) =>
        line.id === lineId ? { ...line, [field]: value } : line
      ),
    }));
  }, []);

  // Réinitialiser le devis
  const resetQuote = useCallback(() => {
    setQuoteData(initialQuoteData);
  }, []);

  // Générer un numéro de devis automatique
  const generateQuoteNumber = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DEV-${year}${month}${day}-${random}`;
  }, []);

  // Initialiser le numéro de devis si vide
  const initializeQuoteNumber = useCallback(() => {
    if (!quoteData.quoteDetails.quoteNumber) {
      updateQuoteDetails('quoteNumber', generateQuoteNumber());
    }
  }, [quoteData.quoteDetails.quoteNumber, generateQuoteNumber, updateQuoteDetails]);

  const value = {
    quoteData,
    updateSender,
    updateLogo,
    updateClient,
    updateQuoteDetails,
    updatePrestation,
    updatePrestationDetails,
    updateLegalConditions,
    addLine,
    removeLine,
    updateLine,
    resetQuote,
    generateQuoteNumber,
    initializeQuoteNumber,
  };

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
};
