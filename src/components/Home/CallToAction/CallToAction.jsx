import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import './CallToAction.css';

const CallToAction = () => {
  const handleContactClick = () => {
    // Scroll vers la section contact ou ouvrir le formulaire
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Si pas de section contact, ouvrir le client email avec un modèle pré-rempli
      const subject = encodeURIComponent('Demande de projet - Prise de contact');
      const body = encodeURIComponent(`Bonjour Jérôme,

Je souhaite discuter d'un projet web avec vous.

Type de projet : [Veuillez préciser]
Budget estimé : [Veuillez préciser]
Délai souhaité : [Veuillez préciser]
Description du projet : [Veuillez décrire votre projet]

Je reste à votre disposition pour échanger plus en détail.

Cordialement,
[Votre nom]
[Votre email]
[Votre téléphone]`);
      
      window.open(`mailto:contact@duboswebservices.fr?subject=${subject}&body=${body}`, '_blank');
    }
  };

  return (
    <div className="cta-container">
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <motion.div
              className="cta-text-container"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="cta-title">Prêt à concrétiser votre projet ?</h2>
              <p className="cta-subtitle">
                Transformons vos idées en réalité numérique. Et promis, pas de
                délais interminables ni de bugs mystérieux.
              </p>
            </motion.div>

            <motion.div
              className="cta-button-container"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                onClick={handleContactClick}
                className="cta-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn-text">Discutons de votre projet</span>
                <HiArrowLongRight className="btn-icon" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CallToAction;
