import React from 'react';
import { motion } from 'framer-motion';
import './Banner.css';

const Banner = () => {
  return (
    <motion.section
              className="about-banner"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <motion.h1
          className="about-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          À propos de <span className="gradient-text">Dubos Web Services</span>
        </motion.h1>
        
        <motion.p
          className="about-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Nous créons des expériences web exceptionnelles qui transforment vos idées en réalité numérique.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Banner;
