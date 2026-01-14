import React from 'react';
import { motion } from 'framer-motion';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Entrepreneuse",
      rating: 5,
      text: "Jérôme a transformé mon idée en une application web magnifique. Son professionnalisme et sa créativité ont dépassé mes attentes. Je recommande vivement !"
    },
    {
      name: "Thomas Martin",
      role: "Directeur Marketing",
      rating: 5,
      text: "Excellent travail sur notre refonte de site. Les performances ont été considérablement améliorées et l'expérience utilisateur est maintenant exceptionnelle."
    },
    {
      name: "BLC Data Services",
      role: "Entreprise",
      rating: 5,
      text: "Super travail effectué par Jérôme ! Il est très sérieux et à l'écoute du besoin. Je le recommande vivement !"
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
    <section className="testimonials-section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Avis Clients
        </motion.h2>
        
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Ce que disent nos clients satisfaits
        </motion.p>

        <motion.div
          className="testimonials-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="testimonial-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <span>{testimonial.role}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
