/**
 * Calcule le total HT d'une ligne de devis
 * @param {number} quantity - Quantité (pour type normal)
 * @param {number} unitPrice - Prix unitaire HT (pour type normal)
 * @param {Array} choices - Tableau de choix (pour type choice)
 * @param {Object} personnel - Objet personnel (pour type personnel)
 * @returns {number} Total HT de la ligne
 */
export const calculateLineTotal = (quantity, unitPrice, choices, personnel) => {
  // Si c'est une ligne avec choix, calculer la somme des prix des choix (quantité × prix unitaire pour chaque choix)
  if (choices && Array.isArray(choices) && choices.length > 0) {
    return parseFloat(
      choices.reduce((sum, choice) => {
        // Rétrocompatibilité : si quantity n'existe pas, utiliser 1 pour le calcul
        const choiceQuantityRaw = parseFloat(choice.quantity);
        const choiceQuantity = isNaN(choiceQuantityRaw) ? 1 : choiceQuantityRaw;
        const choiceUnitPrice = parseFloat(choice.unitPrice) || 0;
        return sum + (choiceQuantity * choiceUnitPrice);
      }, 0).toFixed(2)
    );
  }
  // Si c'est une ligne avec personnel, calculer la somme des prix du personnel
  if (personnel && typeof personnel === 'object' && Object.keys(personnel).length > 0) {
    return parseFloat(
      Object.values(personnel).reduce((sum, item) => {
        const itemQuantity = parseFloat(item.quantity) || 0;
        const itemUnitPrice = parseFloat(item.unitPrice) || 0;
        return sum + (itemQuantity * itemUnitPrice);
      }, 0).toFixed(2)
    );
  }
  // Sinon, calculer normalement avec quantité et prix unitaire
  // S'assurer que les valeurs sont bien numériques
  const qty = parseFloat(quantity);
  const price = parseFloat(unitPrice);
  // Ne pas utiliser 0 si les valeurs sont NaN, utiliser les valeurs brutes ou 0
  const calculatedQty = isNaN(qty) ? 0 : qty;
  const calculatedPrice = isNaN(price) ? 0 : price;
  const calculatedTotal = calculatedQty * calculatedPrice;
  return parseFloat(calculatedTotal.toFixed(2));
};

/**
 * Calcule la quantité totale d'une ligne avec choix
 * @param {Array} choices - Tableau de choix
 * @returns {number} Quantité totale
 */
export const calculateLineTotalQuantity = (choices) => {
  if (!choices || !Array.isArray(choices) || choices.length === 0) {
    return 0;
  }
  return parseFloat(
    choices.reduce((sum, choice) => sum + (parseFloat(choice.quantity) || 0), 0).toFixed(2)
  );
};

/**
 * Calcule le montant de la TVA pour une ligne
 * @param {number} totalHT - Total HT de la ligne
 * @param {number} vatRate - Taux de TVA en pourcentage
 * @returns {number} Montant de la TVA
 */
export const calculateVAT = (totalHT, vatRate) => {
  return parseFloat((totalHT * (vatRate / 100)).toFixed(2));
};

/**
 * Calcule le total TTC d'une ligne de devis
 * @param {number} totalHT - Total HT de la ligne
 * @param {number} vatRate - Taux de TVA en pourcentage
 * @returns {number} Total TTC de la ligne
 */
export const calculateLineTotalTTC = (totalHT, vatRate) => {
  const vat = calculateVAT(totalHT, vatRate);
  return parseFloat((totalHT + vat).toFixed(2));
};

/**
 * Calcule les totaux généraux du devis avec répartition par taux de TVA
 * @param {Array} lines - Tableau des lignes de devis
 * @returns {Object} Objet contenant totalHT, totalVAT, totalTTC, vatBreakdown
 */
export const calculateTotals = (lines) => {
  let totalHT = 0;
  let totalVAT = 0;
  let totalTTC = 0;
  const vatBreakdown = {}; // { taux: { ht: 0, vat: 0 } }

  lines.forEach((line) => {
    const quantity = parseFloat(line.quantity) || 0;
    const unitPrice = parseFloat(line.unitPrice) || 0;
    const vatRate = parseFloat(line.vat) || 0;
    const choices = line.choices || [];
    const personnel = line.personnel || {};

    const lineTotalHT = calculateLineTotal(quantity, unitPrice, choices, personnel);
    const lineVAT = calculateVAT(lineTotalHT, vatRate);
    const lineTotalTTC = calculateLineTotalTTC(lineTotalHT, vatRate);

    totalHT += lineTotalHT;
    totalVAT += lineVAT;
    totalTTC += lineTotalTTC;

    // Répartition par taux de TVA
    if (vatRate > 0) {
      if (!vatBreakdown[vatRate]) {
        vatBreakdown[vatRate] = { ht: 0, vat: 0 };
      }
      vatBreakdown[vatRate].ht += lineTotalHT;
      vatBreakdown[vatRate].vat += lineVAT;
    }
  });

  // Arrondir les valeurs
  Object.keys(vatBreakdown).forEach((rate) => {
    vatBreakdown[rate].ht = parseFloat(vatBreakdown[rate].ht.toFixed(2));
    vatBreakdown[rate].vat = parseFloat(vatBreakdown[rate].vat.toFixed(2));
  });

  return {
    totalHT: parseFloat(totalHT.toFixed(2)),
    totalVAT: parseFloat(totalVAT.toFixed(2)),
    totalTTC: parseFloat(totalTTC.toFixed(2)),
    vatBreakdown,
  };
};

/**
 * Formate un nombre en format monétaire français
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté (ex: "1 234,56 €")
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Formate un pourcentage
 * @param {number} rate - Taux en pourcentage
 * @returns {string} Taux formaté (ex: "20 %")
 */
export const formatPercentage = (rate) => {
  return `${parseFloat(rate).toFixed(2)} %`;
};
