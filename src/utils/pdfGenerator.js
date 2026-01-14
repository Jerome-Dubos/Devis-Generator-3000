import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateLineTotal, calculateTotals, formatCurrency } from './calculations';

/**
 * Génère un PDF à partir des données du devis
 * @param {Object} quoteData - Données complètes du devis
 * @param {string} theme - Thème actuel ('light' ou 'dark')
 */
export const generatePDF = async (quoteData, theme = 'dark') => {
  const { sender, client, prestation, quoteDetails, lines, prestationDetails, legalConditions } = quoteData;
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
  if (sender.siret) {
    doc.text(`SIRET : ${sender.siret}`, margin, yPosition);
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

  // Dates
  if (quoteDetails.issueDate || quoteDetails.validityDate) {
    checkPageBreak(15);
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

  // Déroulé de la prestation (pleine largeur)
  if (prestationDetails.petitDejeuner || prestationDetails.plateauxRepas || 
      prestationDetails.boissons || prestationDetails.serviceLivraison) {
    checkPageBreak(80);
    
    doc.setFontSize(11);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉROULÉ DE LA PRESTATION', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'normal');

    if (prestationDetails.petitDejeuner) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Petit déjeuner', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textSecondary);
      const petitDejLines = doc.splitTextToSize(prestationDetails.petitDejeuner, contentWidth);
      doc.text(petitDejLines, margin, yPosition);
      yPosition += petitDejLines.length * 5 + 5;
    }

    if (prestationDetails.plateauxRepas) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Plateaux repas', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textSecondary);
      const plateauxLines = doc.splitTextToSize(prestationDetails.plateauxRepas, contentWidth);
      doc.text(plateauxLines, margin, yPosition);
      yPosition += plateauxLines.length * 5 + 5;
    }

    if (prestationDetails.boissons) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Boissons', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textSecondary);
      const boissonsLines = doc.splitTextToSize(prestationDetails.boissons, contentWidth);
      doc.text(boissonsLines, margin, yPosition);
      yPosition += boissonsLines.length * 5 + 5;
    }

    if (prestationDetails.serviceLivraison) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Service forfait livraison + rangement', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textSecondary);
      const serviceLines = doc.splitTextToSize(prestationDetails.serviceLivraison, contentWidth);
      doc.text(serviceLines, margin, yPosition);
      yPosition += serviceLines.length * 5 + 5;
    }
    yPosition += 5;
  }

  // Conditions légales (pleine largeur)
  if (legalConditions.accompte || legalConditions.decharge || legalConditions.mentionsLegales) {
    checkPageBreak(60);
    
    doc.setFontSize(11);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('CONDITIONS LÉGALES', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'normal');

    if (legalConditions.accompte) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Accompte versé', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textSecondary);
      const accompteLines = doc.splitTextToSize(legalConditions.accompte, contentWidth);
      doc.text(accompteLines, margin, yPosition);
      yPosition += accompteLines.length * 5 + 5;
    }

    if (legalConditions.decharge) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Décharge de responsabilité après livraison', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textSecondary);
      const dechargeLines = doc.splitTextToSize(legalConditions.decharge, contentWidth);
      doc.text(dechargeLines, margin, yPosition);
      yPosition += dechargeLines.length * 5 + 5;
    }

    if (legalConditions.mentionsLegales) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Mentions légales', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textSecondary);
      const mentionsLines = doc.splitTextToSize(legalConditions.mentionsLegales, contentWidth);
      doc.text(mentionsLines, margin, yPosition);
      yPosition += mentionsLines.length * 5;
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
