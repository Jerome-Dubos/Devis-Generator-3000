import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './ContactInfo.css';

const ContactInfo = () => {
  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email",
      value: "contact@duboswebservices.fr",
      link: "mailto:contact@duboswebservices.fr"
    },
    {
      icon: FaPhone,
      title: "Téléphone",
      value: "07 69 28 91 79",
      link: "tel:+33769289179"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Localisation",
      value: "France",
      link: "#"
    }
  ];

  return (
    <motion.div
      className="contact-info"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <h2>Informations de contact</h2>
      <p>N'hésitez pas à nous contacter pour discuter de votre projet.</p>
      
      <div className="info-list">
        {contactInfo.map((info, index) => (
          <motion.div
            key={info.title}
            className="info-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <info.icon className="info-icon" />
            <div className="info-content">
              <h3>{info.title}</h3>
              <a href={info.link} target="_blank" rel="noopener noreferrer">
                {info.value}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ContactInfo;
