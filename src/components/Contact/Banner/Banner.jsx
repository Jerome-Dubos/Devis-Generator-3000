import React from 'react';
import { motion } from 'framer-motion';
import './Banner.css';

const Banner = () => {
  return (
    <motion.section
              className="contact-banner"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <motion.h1
          className="contact-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Contactez <span className="gradient-text">Dubos Web Services</span>
        </motion.h1>
        
        <motion.p
          className="contact-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Prêt à transformer votre vision en réalité ? Parlons de votre projet !
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Banner;
