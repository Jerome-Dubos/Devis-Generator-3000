import React, { useEffect } from 'react';
import './Banner.css';
import { motion, useAnimation } from 'framer-motion';
import { FaReact, FaCode, FaRocket, FaPalette, FaMousePointer, FaRoute, FaBolt } from 'react-icons/fa';
import { SiVite, SiFramer } from 'react-icons/si';

const Banner = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const techStack = [
    { name: "React", icon: FaReact, color: "#61DAFB", desc: "Interface utilisateur moderne" },
    { name: "Vite", icon: SiVite, color: "#646CFF", desc: "Build tool ultra-rapide" },
    { name: "Framer Motion", icon: SiFramer, color: "#FF6B6B", desc: "Animations fluides" },
    { name: "React Router", icon: FaRoute, color: "#CA4245", desc: "Navigation SPA" },
    { name: "React Icons", icon: FaPalette, color: "#FFD93D", desc: "Icônes vectorielles" },
    { name: "Smooth Scroll", icon: FaMousePointer, color: "#6BCF7F", desc: "Défilement fluide" }
  ];



  return (
    <div className="banner-container">
      {/* Banner Section */}
      <motion.section
        className="banner-section"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="banner-content">
          <motion.div
            className="banner-badge"
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <FaRocket className="rocket-icon" />
            <span>Nouveau Projet React</span>
          </motion.div>
          
          <motion.h1
            className="banner-title"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Bienvenue dans votre
            <span className="gradient-text"> Application React</span>
          </motion.h1>
          
          <motion.p
            className="banner-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Une interface moderne, performante et esthétique créée avec les meilleures technologies
          </motion.p>

          <motion.div
            className="banner-stats"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <div className="stat">
              <FaBolt className="stat-icon" />
              <span>Vite</span>
            </div>
            <div className="stat">
              <FaCode className="stat-icon" />
              <span>6 Dépendances</span>
            </div>
            <div className="stat">
              <FaReact className="stat-icon" />
              <span>React 18</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="banner-visual"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
        >
          <div className="floating-card">
            <FaReact className="react-logo" />
          </div>
        </motion.div>
      </motion.section>

      {/* Tech Stack Section */}
      <motion.section
        className="tech-section"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.h2
          className="section-title"
          variants={itemVariants}
        >
          Technologies Installées
        </motion.h2>
        
        <motion.p
          className="section-subtitle"
          variants={itemVariants}
        >
          Votre projet est équipé des dernières technologies pour un développement moderne
        </motion.p>

        <motion.div
          className="tech-grid"
          variants={containerVariants}
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="tech-card"
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="tech-icon" style={{ color: tech.color }}>
                <tech.icon size={32} />
              </div>
              <h3>{tech.name}</h3>
              <p>{tech.desc}</p>
              <div className="tech-glow" style={{ backgroundColor: tech.color }}></div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>


    </div>
  );
};

export default Banner;
