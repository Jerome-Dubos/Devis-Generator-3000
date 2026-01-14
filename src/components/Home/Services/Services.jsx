import React from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaServer, FaTools, FaChartLine, FaRedo, FaSearchPlus } from 'react-icons/fa';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: FaLaptopCode,
      title: "Développement Web",
      description: "Création de sites vitrines, portfolios et applications web React avec une attention particulière portée à l'expérience utilisateur et aux performances.",
      technologies: ["React", "HTML5", "CSS3", "JavaScript", "Responsive Design"]
    },
    {
      icon: FaServer,
      title: "Développement Fullstack",
      description: "Solutions complètes intégrant frontend et backend pour des applications web dynamiques, sécurisées et évolutives.",
      technologies: ["Node.js", "Express", "MongoDB", "API REST", "Authentication"]
    },
    {
      icon: FaTools,
      title: "Maintenance & Support",
      description: "Services de maintenance proactive incluant mises à jour régulières, sauvegardes automatisées et support technique réactif.",
      technologies: ["Monitoring", "Backups", "Debugging", "Performance"]
    },
    {
      icon: FaChartLine,
      title: "Conseil & Stratégie",
      description: "Accompagnement stratégique avec audit technique, élaboration de cahier des charges et formation technique personnalisée.",
      technologies: ["Audit", "Documentation", "Formation", "Planification"]
    },
    {
      icon: FaRedo,
      title: "Refonte de Sites",
      description: "Modernisation complète de sites existants pour améliorer l'expérience utilisateur, les performances et la sécurité.",
      technologies: ["UX/UI", "Migration", "Optimisation", "Sécurité"]
    },
    {
      icon: FaSearchPlus,
      title: "Optimisation SEO",
      description: "Amélioration du référencement naturel avec audit technique, optimisation on-page et stratégie de contenu.",
      technologies: ["Audit SEO", "Performance", "Métadonnées", "Analytics"]
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
    <section className="services-section" id="services">
      <div className="container">
        <motion.div
          className="services-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Nos Services</h2>
          <p className="section-subtitle">
            Des solutions web complètes pour transformer vos idées en réalité
          </p>

          <motion.div
            className="services-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="service-card"
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="service-icon">
                  <service.icon size={40} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-technologies">
                  {service.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
