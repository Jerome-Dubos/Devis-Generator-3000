import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaUsers, FaPalette } from 'react-icons/fa';
import './Values.css';

const Values = () => {
  const values = [
    {
      icon: FaLightbulb,
      title: "Innovation",
      description: "Nous repoussons les limites de la technologie pour créer des solutions uniques."
    },
    {
      icon: FaUsers,
      title: "Collaboration",
      description: "Nous travaillons en étroite collaboration avec nos clients pour des résultats optimaux."
    },
    {
      icon: FaPalette,
      title: "Excellence",
      description: "Chaque projet est une œuvre d'art, créée avec passion et attention aux détails."
    }
  ];

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
      className="values-section"
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
          Nos Valeurs
        </motion.h2>
        
        <motion.div
          className="values-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="value-card"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="value-icon">
                <value.icon size={40} />
              </div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Values;
