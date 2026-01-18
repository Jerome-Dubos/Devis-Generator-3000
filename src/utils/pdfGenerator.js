import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateLineTotal, calculateTotals, formatCurrency } from './calculations';

/**
 * Génère un PDF à partir des données du devis
 * @param {Object} quoteData - Données complètes du devis
 * @param {string} theme - Thème actuel ('light' ou 'dark')
 */
export const generatePDF = async (quoteData, theme = 'dark') => {
  const { sender, client, prestation, quoteDetails, lines, prestationDetails, legalConditions, guarantees, taxSettings } = quoteData;
  const totals = calculateTotals(lines);

  // Créer le document PDF en format A4
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Couleurs selon le thème
  const colors = {
    primary: [212, 175, 55], // Or
    text: theme === 'light' ? [44, 44, 44] : [245, 245, 245],
    textSecondary: theme === 'light' ? [90, 90, 90] : [179, 179, 179],
    background: theme === 'light' ? [248, 246, 240] : [10, 10, 10],
    backgroundLight: theme === 'light' ? [255, 255, 255] : [20, 20, 20],
    border: theme === 'light' ? [212, 175, 55, 0.3] : [212, 175, 55, 0.4],
  };

  // Appliquer la couleur de fond de page selon le thème
  if (theme === 'dark') {
    doc.setFillColor(...colors.background);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Fonction pour formater une date en français
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Fonction pour ajouter une nouvelle page si nécessaire
  const checkPageBreak = (requiredHeight) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Fonction pour formater un montant sans le symbole € pour le PDF (avec espaces pour milliers)
  const formatCurrencyPDF = (amount) => {
    // Formater avec des espaces pour les milliers
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return formatted.replace(/\u202F/g, ' '); // Remplacer les espaces insécables par des espaces normaux
  };

  // Fonction pour ajouter une image (logo) avec proportions préservées
  const addLogo = () => {
    if (sender.logoUrl) {
      try {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const maxWidth = 60;
            const maxHeight = 40;
            
            // Calculer les dimensions en préservant les proportions
            let imgWidth = img.width;
            let imgHeight = img.height;
            const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
            
            imgWidth = imgWidth * ratio;
            imgHeight = imgHeight * ratio;
            
            doc.addImage(sender.logoUrl, 'PNG', margin, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 5;
            resolve();
          };
          img.onerror = () => resolve();
          img.src = sender.logoUrl;
        });
      } catch (error) {
        console.error('Erreur lors du chargement du logo:', error);
        return Promise.resolve();
      }
    }
    return Promise.resolve();
  };

  // En-tête avec ligne dorée
  doc.setFillColor(...colors.primary);
  doc.rect(margin, yPosition, contentWidth, 2, 'F');
  yPosition += 10;

  // Logo (on attend qu'il soit chargé)
  await addLogo();

  // Titre DEVIS
  doc.setFontSize(32);
  doc.setTextColor(...colors.primary);
  doc.setFont('helvetica', 'bold');
  const titleText = 'DEVIS';
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, pageWidth - margin - titleWidth, yPosition);
  yPosition += 8;

  // Numéro de devis
  if (quoteDetails.quoteNumber) {
    doc.setFontSize(10);
    doc.setTextColor(...colors.textSecondary);
    doc.setFont('helvetica', 'normal');
    const quoteNumberText = `N° ${quoteDetails.quoteNumber}`;
    const quoteNumberWidth = doc.getTextWidth(quoteNumberText);
    doc.text(quoteNumberText, pageWidth - margin - quoteNumberWidth, yPosition);
  }
  yPosition += 15;

  // Informations prestation
  if (prestation.title) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(prestation.title, margin, yPosition);
    yPosition += 8;

    if (prestation.object) {
      doc.setFontSize(10);
      doc.setTextColor(...colors.text);
      doc.setFont('helvetica', 'normal');
      doc.text(`Objet : ${prestation.object}`, margin, yPosition);
      yPosition += 6;
    }

    if (prestation.participants) {
      doc.setFontSize(10);
      doc.text(`Participants : ${prestation.participants}`, margin, yPosition);
      yPosition += 6;
    }

    if (prestation.startDate) {
      doc.text(`Date de début : ${formatDate(prestation.startDate)}`, margin, yPosition);
      yPosition += 6;
    }

    if (prestation.estimatedDuration) {
      doc.text(`Durée estimée : ${prestation.estimatedDuration}`, margin, yPosition);
      yPosition += 6;
    }

    if (prestation.deliveryConditions) {
      doc.text(`Conditions de livraison : ${prestation.deliveryConditions}`, margin, yPosition);
      yPosition += 6;
    }
    yPosition += 5;
  }

  // Informations émetteur et client côte à côte
  const infoYStart = yPosition;
  const infoColumnWidth = (contentWidth - 20) / 2;

  // Émetteur
  doc.setFontSize(9);
  doc.setTextColor(...colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('ÉMETTEUR', margin, yPosition);
  yPosition += 5;

  doc.setFontSize(9);
  doc.setTextColor(...colors.text);
  doc.setFont('helvetica', 'normal');
  
  if (sender.name) doc.text(sender.name, margin, yPosition);
  yPosition += 5;

  if (sender.legalForm) {
    doc.text(sender.legalForm, margin, yPosition);
    yPosition += 5;
  }

  if (sender.commercialName) {
    doc.text(`Nom commercial : ${sender.commercialName}`, margin, yPosition);
    yPosition += 5;
  }

  const senderAddress = [];
  if (sender.address) senderAddress.push(sender.address);
  if (sender.postalCode || sender.city) {
    senderAddress.push([sender.postalCode, sender.city].filter(Boolean).join(' '));
  }
  if (senderAddress.length > 0) {
    doc.text(senderAddress.join(', '), margin, yPosition);
    yPosition += 5;
  }

  if (sender.phone) {
    doc.text(sender.phone, margin, yPosition);
    yPosition += 5;
  }
  if (sender.email) {
    doc.text(sender.email, margin, yPosition);
    yPosition += 5;
  }
  if (sender.siren) {
    doc.text(`SIREN : ${sender.siren}`, margin, yPosition);
    yPosition += 5;
  }
  if (sender.siret) {
    doc.text(`SIRET : ${sender.siret}`, margin, yPosition);
    yPosition += 5;
  }
  if (sender.rcs) {
    doc.text(`RCS : ${sender.rcs}`, margin, yPosition);
    yPosition += 5;
  }
  if (sender.vatNumber) {
    doc.text(`TVA intracommunautaire : ${sender.vatNumber}`, margin, yPosition);
    yPosition += 5;
  }

  // Client (colonne de droite)
  const clientYStart = infoYStart;
  yPosition = clientYStart;
  doc.setFontSize(9);
  doc.setTextColor(...colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', margin + infoColumnWidth + 20, yPosition);
  yPosition += 5;

  doc.setFontSize(9);
  doc.setTextColor(...colors.text);
  doc.setFont('helvetica', 'normal');

  if (client.name) doc.text(client.name, margin + infoColumnWidth + 20, yPosition);
  yPosition += 5;

  const clientAddress = [];
  if (client.address) clientAddress.push(client.address);
  if (client.postalCode || client.city) {
    clientAddress.push([client.postalCode, client.city].filter(Boolean).join(' '));
  }
  if (clientAddress.length > 0) {
    doc.text(clientAddress.join(', '), margin + infoColumnWidth + 20, yPosition);
    yPosition += 5;
  }

  if (client.phone) {
    doc.text(client.phone, margin + infoColumnWidth + 20, yPosition);
    yPosition += 5;
  }
  if (client.email) {
    doc.text(client.email, margin + infoColumnWidth + 20, yPosition);
    yPosition += 5;
  }

  // Prendre la position la plus basse
  yPosition = Math.max(yPosition, infoYStart + 40);
  yPosition += 10;

  // Dates et informations
  if (quoteDetails.issueDate || quoteDetails.validityDate || quoteDetails.isFree !== undefined) {
    checkPageBreak(20);
    doc.setFontSize(9);
    doc.setTextColor(...colors.textSecondary);
    doc.setFont('helvetica', 'normal');
    
    if (quoteDetails.issueDate) {
      doc.text(`Date d'émission : ${formatDate(quoteDetails.issueDate)}`, margin, yPosition);
      yPosition += 6;
    }
    if (quoteDetails.validityDate) {
      doc.text(`Date de validité : ${formatDate(quoteDetails.validityDate)}`, margin, yPosition);
      yPosition += 6;
    }
    if (quoteDetails.isFree !== undefined) {
      doc.text(`Devis : ${quoteDetails.isFree !== false ? 'Gratuit' : 'Payant'}`, margin, yPosition);
      yPosition += 6;
    }
    yPosition += 5;
  }

  // Tableau des lignes
  if (lines.length > 0) {
    checkPageBreak(50);

    const tableData = lines.map((line, index) => {
      const lineTotalHT = calculateLineTotal(line.quantity, line.unitPrice);
      return [
        line.description || `Ligne ${index + 1}`,
        String(line.quantity || '-'),
        line.unitPrice ? `${formatCurrencyPDF(line.unitPrice)} €` : '-',
        line.vat ? `${line.vat} %` : '-',
        `${formatCurrencyPDF(lineTotalHT)} €`,
      ];
    });

    autoTable(doc, {
      startY: yPosition,
      head: [['Désignation', 'Qté', 'PU HT', 'TVA', 'Total HT']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        textColor: colors.text,
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: theme === 'light' ? [248, 246, 240] : [18, 18, 18],
      },
      columnStyles: {
        0: { cellWidth: 'auto' }, // Désignation
        1: { halign: 'center', cellWidth: 20 }, // Quantité
        2: { halign: 'right', cellWidth: 35 }, // PU HT
        3: { halign: 'center', cellWidth: 25 }, // TVA
        4: { halign: 'right', cellWidth: 35, textColor: colors.primary, fontStyle: 'bold' }, // Total HT
      },
      margin: { left: margin, right: margin },
      styles: {
        fillColor: theme === 'dark' ? [15, 15, 15] : [255, 255, 255],
        lineColor: colors.border,
        lineWidth: 0.5,
      },
    });

    yPosition = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : yPosition + 50;
  }

  // Totaux
  checkPageBreak(60);
  
  const totalsX = pageWidth - margin - 80;
  doc.setFontSize(9);
  doc.setTextColor(...colors.textSecondary);
  doc.setFont('helvetica', 'normal');
  
  doc.text('Total HT', totalsX, yPosition);
  doc.text(`${formatCurrencyPDF(totals.totalHT)} €`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 7;

  // Répartition par taux de TVA (affichage uniquement du montant TVA)
  if (totals.vatBreakdown && Object.keys(totals.vatBreakdown).length > 0) {
    Object.entries(totals.vatBreakdown)
      .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
      .forEach(([rate, amounts]) => {
        doc.setFontSize(8);
        doc.text(`TVA ${rate}%`, totalsX, yPosition);
        doc.text(`${formatCurrencyPDF(amounts.vat)} €`, 
          pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 6;
      });
    yPosition += 2;
  }

  doc.setFontSize(9);
  doc.text('Total TVA', totalsX, yPosition);
  doc.text(`${formatCurrencyPDF(totals.totalVAT)} €`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 7;

  // Ligne de séparation
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.5);
  doc.line(totalsX, yPosition, pageWidth - margin, yPosition);
  yPosition += 7;

  // Total TTC en gras et doré
  doc.setFontSize(12);
  doc.setTextColor(...colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Total TTC', totalsX, yPosition);
  doc.text(`${formatCurrencyPDF(totals.totalTTC)} €`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 15;

  // Conditions de paiement
  if (quoteDetails.paymentConditions) {
    checkPageBreak(30);
    doc.setFontSize(11);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('CONDITIONS DE PAIEMENT', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(9);
    doc.setTextColor(...colors.textSecondary);
    doc.setFont('helvetica', 'normal');
    const paymentLines = doc.splitTextToSize(quoteDetails.paymentConditions, contentWidth);
    doc.text(paymentLines, margin, yPosition);
    yPosition += paymentLines.length * 5 + 10;
  }

  // Garanties
  if (guarantees && ((guarantees.legalWarranty !== false || guarantees.hiddenDefectsWarranty !== false || guarantees.warrantyDuration || guarantees.afterSalesService))) {
    checkPageBreak(40);
    doc.setFontSize(11);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('GARANTIES ET SERVICE APRÈS-VENTE', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(9);
    doc.setTextColor(...colors.textSecondary);
    doc.setFont('helvetica', 'normal');
    
    const guaranteesText = [];
    if (guarantees.legalWarranty !== false) {
      guaranteesText.push('• Garantie légale de conformité (obligatoire)');
    }
    if (guarantees.hiddenDefectsWarranty !== false) {
      guaranteesText.push('• Garantie des vices cachés');
    }
    if (guarantees.warrantyDuration) {
      guaranteesText.push(`• Durée de garantie : ${guarantees.warrantyDuration}`);
    }
    
    if (guaranteesText.length > 0) {
      guaranteesText.forEach((text) => {
        doc.text(text, margin, yPosition);
        yPosition += 6;
      });
    }
    
    if (guarantees.afterSalesService) {
      yPosition += 3;
      doc.text('Service après-vente :', margin, yPosition);
      yPosition += 5;
      const serviceLines = doc.splitTextToSize(guarantees.afterSalesService, contentWidth);
      doc.text(serviceLines, margin, yPosition);
      yPosition += serviceLines.length * 5;
    }
    yPosition += 10;
  }

  // Contact réclamations
  if (sender.complaintsContact && (sender.complaintsContact.name || sender.complaintsContact.email || sender.complaintsContact.phone || sender.complaintsContact.address)) {
    checkPageBreak(30);
    doc.setFontSize(11);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTACT POUR RÉCLAMATIONS', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(9);
    doc.setTextColor(...colors.textSecondary);
    doc.setFont('helvetica', 'normal');
    
    if (sender.complaintsContact.name) {
      doc.setFont('helvetica', 'bold');
      doc.text(sender.complaintsContact.name, margin, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 6;
    }
    if (sender.complaintsContact.address) {
      doc.text(sender.complaintsContact.address, margin, yPosition);
      yPosition += 6;
    }
    if (sender.complaintsContact.email) {
      doc.text(`Email : ${sender.complaintsContact.email}`, margin, yPosition);
      yPosition += 6;
    }
    if (sender.complaintsContact.phone) {
      doc.text(`Téléphone : ${sender.complaintsContact.phone}`, margin, yPosition);
      yPosition += 6;
    }
    yPosition += 10;
  }

  // Déroulé de la prestation (pleine largeur)
  if (prestationDetails && prestationDetails.length > 0 && prestationDetails.some(section => section.content)) {
    checkPageBreak(80);
    
    doc.setFontSize(11);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉROULÉ DE LA PRESTATION', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'normal');

    prestationDetails.forEach((section) => {
      if (!section.content) return;
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text(section.label || 'Section', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textSecondary);
      const sectionLines = doc.splitTextToSize(section.content, contentWidth);
      doc.text(sectionLines, margin, yPosition);
      yPosition += sectionLines.length * 5 + 5;
    });
    yPosition += 5;
  }

  // Conditions légales (pleine largeur)
  const hasAccompte = legalConditions.accompte && (legalConditions.accompte.montant || legalConditions.accompte.solde || legalConditions.accompte.modalites);
  const hasDecharge = legalConditions.decharge && (legalConditions.decharge.date || legalConditions.decharge.delai);
  const hasMentions = legalConditions.mentionsLegales && legalConditions.mentionsLegales.length > 0 && legalConditions.mentionsLegales.some(m => m.content);

  if (hasAccompte || hasDecharge || hasMentions) {
    checkPageBreak(60);
    
    doc.setFontSize(11);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('CONDITIONS LÉGALES', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'normal');

    if (hasAccompte) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Accompte versé', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textSecondary);
      const accompteText = `Un acompte de ${legalConditions.accompte.montant || '[montant]'} est requis à la signature du devis. Le solde restant de ${legalConditions.accompte.solde || '[solde]'} devra être réglé avant le début de la prestation ou selon les modalités suivantes : ${legalConditions.accompte.modalites || '[modalités de paiement]'}.`;
      const accompteLines = doc.splitTextToSize(accompteText, contentWidth);
      doc.text(accompteLines, margin, yPosition);
      yPosition += accompteLines.length * 5 + 5;
    }

    if (hasDecharge) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Décharge de responsabilité après livraison', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textSecondary);
      const dechargeText = `Le client reconnaît avoir vérifié la conformité de la prestation livrée le ${legalConditions.decharge.date || '[date de livraison]'}. Toute réclamation doit être formulée par écrit dans un délai de ${legalConditions.decharge.delai || '[délai en jours]'} jours suivant la livraison. Passé ce délai, la prestation sera considérée comme acceptée sans réserve.`;
      const dechargeLines = doc.splitTextToSize(dechargeText, contentWidth);
      doc.text(dechargeLines, margin, yPosition);
      yPosition += dechargeLines.length * 5 + 5;
    }

    if (hasMentions) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Mentions légales', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textSecondary);
      
      legalConditions.mentionsLegales.forEach((mention) => {
        if (!mention.content) return;
        if (mention.title) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...colors.primary);
          doc.text(mention.title, margin, yPosition);
          yPosition += 5;
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.textSecondary);
        }
        const mentionLines = doc.splitTextToSize(mention.content, contentWidth);
        doc.text(mentionLines, margin, yPosition);
        yPosition += mentionLines.length * 5 + 5;
      });
      yPosition -= 5;
    }
  }

  // Pied de page
  const footerY = pageHeight - 15;
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setFontSize(7);
  doc.setTextColor(...colors.textSecondary);
  doc.setFont('helvetica', 'normal');
  
  const footerText = [
    sender.name,
    sender.email,
    sender.phone,
  ].filter(Boolean).join(' - ');
  
  const footerTextWidth = doc.getTextWidth(footerText);
  doc.text(footerText, (pageWidth - footerTextWidth) / 2, footerY + 5, { align: 'center' });

  // Nom du fichier
  const fileName = quoteDetails.quoteNumber 
    ? `Devis-${quoteDetails.quoteNumber}.pdf`
    : `Devis-${new Date().toISOString().split('T')[0]}.pdf`;

  // Télécharger le PDF
  doc.save(fileName);
};
