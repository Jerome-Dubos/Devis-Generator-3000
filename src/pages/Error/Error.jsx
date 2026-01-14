import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaRocket, FaSadTear, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import './Error.css';

const Error = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Recherche Google avec le terme saisi
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  const floatingElements = [
    { id: 1, emoji: '🚀', delay: 0 },
    { id: 2, emoji: '💻', delay: 0.5 },
    { id: 3, emoji: '⚡', delay: 1 },
    { id: 4, emoji: '🎯', delay: 1.5 },
    { id: 5, emoji: '🌟', delay: 2 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="error-container">
      {/* Background Animation */}
      <div className="error-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Floating Elements */}
      <AnimatePresence>
        {floatingElements.map((element, index) => (
          <motion.div
            key={element.id}
            className={`floating-element floating-element-${index + 1}`}
            variants={floatingVariants}
            animate="float"
            initial={{ opacity: 0 }}
            transition={{ delay: element.delay }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="error-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number */}
        <motion.div
          className="error-number"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "backOut" }}
        >
          <span className="number-4">4</span>
          <motion.div
            className="sad-face"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaSadTear />
          </motion.div>
          <span className="number-4">4</span>
        </motion.div>

        {/* Error Message */}
        <motion.div className="error-message" variants={itemVariants}>
          <motion.h1
            className="error-title"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Oups ! Page introuvable
          </motion.h1>
          
          <motion.p
            className="error-description"
            variants={itemVariants}
          >
            La page que vous recherchez semble avoir pris une pause café ☕
          </motion.p>
        </motion.div>

        {/* Search Section */}
        <motion.div className="search-section" variants={itemVariants}>
          <form className="search-container" onSubmit={handleSearch}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher quelque chose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <motion.button
              type="submit"
              className="search-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Rechercher
            </motion.button>
          </form>
        </motion.div>

        {/* Action Buttons */}
        <motion.div className="action-buttons" variants={itemVariants}>
          <Link to="/">
            <motion.button
              className="action-btn primary-btn"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(118, 75, 162, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <FaHome />
              <span>Retour à l'accueil</span>
              {isHovered && (
                <motion.div
                  className="btn-particles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FaRocket />
                  <FaRocket />
                  <FaRocket />
                </motion.div>
              )}
            </motion.button>
          </Link>

          <motion.button
            className="action-btn secondary-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            <FaArrowLeft />
            <span>Page précédente</span>
          </motion.button>
        </motion.div>

        {/* Fun Facts */}
        <motion.div className="fun-facts" variants={itemVariants}>
          <div className="fact-card">
            <FaExclamationTriangle className="fact-icon" />
            <h3>Le saviez-vous ?</h3>
            <p>404 est le code d'erreur HTTP le plus célèbre du web !</p>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <motion.div className="quick-links" variants={itemVariants}>
          <h3>Liens rapides :</h3>
          <div className="links-grid">
            <Link to="/" className="quick-link">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                🏠 Accueil
              </motion.div>
            </Link>
            <Link to="/about" className="quick-link">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                ℹ️ À propos
              </motion.div>
            </Link>
            <Link to="/contact" className="quick-link">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                📧 Contact
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Error;
