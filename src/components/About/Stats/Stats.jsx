import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaCode, FaAward } from 'react-icons/fa';
import './Stats.css';

const Stats = () => {
  const stats = [
    { number: "50+", label: "Projets Réalisés", icon: FaRocket },
    { number: "3+", label: "Années d'Expérience", icon: FaCode },
    { number: "100%", label: "Satisfaction Client", icon: FaAward },
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
      className="stats-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <stat.icon className="stat-icon" />
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Stats;
