import React from 'react';
import './Footer.css';
import { motion } from 'framer-motion';
import { FaHeart, FaRocket, FaGithub, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo et description */}
          <motion.div 
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo">
              <a 
                href="https://www.duboswebservices.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-company-name"
              >
                <img src="/images/logo.png" alt="Dubos Web Services" className="footer-logo-image" />
              </a>
            </div>
            <p className="footer-description">
              Création d'applications web modernes et performantes
            </p>
          </motion.div>

          {/* Liens rapides */}
          <motion.div 
            className="footer-links"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4>Liens rapides</h4>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/about">À propos</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div 
            className="footer-services"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4>Services</h4>
            <ul>
              <li>Développement React</li>
              <li>Applications Web</li>
              <li>Optimisation SEO</li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div 
            className="footer-contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4>Contact</h4>
            <p>contact@duboswebservices.fr</p>
            <div className="qr-code">
              <a href="https://www.duboswebservices.fr" target="_blank" rel="noopener noreferrer">
                <img src="/images/qrcode.png" alt="QR Code Dubos Web Services" />
              </a>
            </div>
            <div className="social-links">
              <a href="https://github.com/Jerome-Dubos" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://www.instagram.com/duboswebservices/" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="footer-divider"></div>
          <p className="copyright">
            © {currentYear} <a 
              href="https://www.duboswebservices.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="company-link"
            >
              Dubos Web Services
            </a> — Tous droits réservés.
          </p>
          <p className="made-with">
            Fait avec <FaHeart className="heart-icon" /> par Dubos Web Services
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
