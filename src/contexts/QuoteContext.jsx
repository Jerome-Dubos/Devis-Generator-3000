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
    legalForm: '', // Forme juridique (SARL, SAS, EI, etc.)
    commercialName: '', // Nom commercial (si différent)
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
    siren: '', // SIREN (9 chiffres)
    siret: '', // SIRET complet (14 chiffres)
    rcs: '', // Numéro RCS (ex: RCS Paris B 123 456 789)
    vatNumber: '', // Numéro de TVA intracommunautaire (ex: FR12345678901)
    logo: null,
    logoUrl: null, // URL de l'image pour affichage
    complaintsContact: { // Contact pour réclamations
      name: '',
      address: '',
      email: '',
      phone: '',
    },
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
    startDate: '', // Date de début de la prestation
    estimatedDuration: '', // Durée estimée (ex: "3 mois", "15 jours")
    deliveryConditions: '', // Conditions de livraison/exécution
  },
  // Détails du devis
  quoteDetails: {
    quoteNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    validityDate: '',
    isFree: true, // Devis gratuit ou payant
    paymentConditions: '', // Conditions de paiement détaillées
  },
  // Taxe et TVA
  taxSettings: {
    vatApplicable: true, // TVA applicable ou non
    vatExemptionReason: '', // Raison d'exemption si applicable
  },
  // Garanties et service après-vente
  guarantees: {
    legalWarranty: true, // Garantie légale de conformité
    hiddenDefectsWarranty: true, // Garantie des vices cachés
    afterSalesService: '', // Service après-vente
    warrantyDuration: '', // Durée de garantie si applicable
  },
  // Lignes de devis
  lines: [],
  // Déroulé de la prestation (tableau dynamique)
  prestationDetails: [],
  // Conditions légales
  legalConditions: {
    accompte: {
      montant: '',
      solde: '',
      modalites: '',
    },
    decharge: {
      date: '',
      delai: '',
    },
    mentionsLegales: [],
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

  // Ajouter une section de prestation
  const addPrestationDetail = useCallback(() => {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSection = {
      id: uniqueId,
      label: `Section ${quoteData.prestationDetails.length + 1}`,
      content: '',
    };
    setQuoteData((prev) => ({
      ...prev,
      prestationDetails: [...prev.prestationDetails, newSection],
    }));
    return newSection.id;
  }, [quoteData.prestationDetails.length]);

  // Supprimer une section de prestation
  const removePrestationDetail = useCallback((sectionId) => {
    setQuoteData((prev) => ({
      ...prev,
      prestationDetails: prev.prestationDetails.filter((section) => section.id !== sectionId),
    }));
  }, []);

  // Mettre à jour une section de prestation
  const updatePrestationDetail = useCallback((sectionId, field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      prestationDetails: prev.prestationDetails.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
    }));
  }, []);

  // Mettre à jour les conditions légales
  const updateLegalConditions = useCallback((section, field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      legalConditions: {
        ...prev.legalConditions,
        [section]: {
          ...prev.legalConditions[section],
          [field]: value,
        },
      },
    }));
  }, []);

  // Ajouter une mention légale
  const addLegalMention = useCallback(() => {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newMention = {
      id: uniqueId,
      title: '',
      content: '',
    };
    setQuoteData((prev) => ({
      ...prev,
      legalConditions: {
        ...prev.legalConditions,
        mentionsLegales: [...prev.legalConditions.mentionsLegales, newMention],
      },
    }));
    return newMention.id;
  }, []);

  // Supprimer une mention légale
  const removeLegalMention = useCallback((mentionId) => {
    setQuoteData((prev) => ({
      ...prev,
      legalConditions: {
        ...prev.legalConditions,
        mentionsLegales: prev.legalConditions.mentionsLegales.filter((mention) => mention.id !== mentionId),
      },
    }));
  }, []);

  // Mettre à jour une mention légale
  const updateLegalMention = useCallback((mentionId, field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      legalConditions: {
        ...prev.legalConditions,
        mentionsLegales: prev.legalConditions.mentionsLegales.map((mention) =>
          mention.id === mentionId ? { ...mention, [field]: value } : mention
        ),
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

  // Mettre à jour les paramètres de TVA
  const updateTaxSettings = useCallback((field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      taxSettings: {
        ...prev.taxSettings,
        [field]: value,
      },
    }));
  }, []);

  // Mettre à jour les garanties
  const updateGuarantees = useCallback((field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      guarantees: {
        ...prev.guarantees,
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
    addPrestationDetail,
    removePrestationDetail,
    updatePrestationDetail,
    updateLegalConditions,
    addLegalMention,
    removeLegalMention,
    updateLegalMention,
    updateTaxSettings,
    updateGuarantees,
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
