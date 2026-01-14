import React from 'react';
import { motion } from 'framer-motion';
import './Team.css';

const Team = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      className="team-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Notre Équipe
        </motion.h2>
        
        <motion.div
          className="team-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="team-member"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="member-avatar">
              <img src="/images/logo.png" alt="Jérôme Dubos" />
            </div>
            <h3>Jérôme Dubos</h3>
            <p className="member-role">Développeur Fullstack</p>
            <p className="member-description">
              Passionné par le développement web et l'innovation technologique. 
              Spécialisé dans React, Node.js et les solutions web modernes.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Team;
