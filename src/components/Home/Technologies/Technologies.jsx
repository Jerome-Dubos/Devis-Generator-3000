import React from 'react';
import { motion } from 'framer-motion';
import { SiCss3, SiGit, SiHtml5, SiJavascript, SiMongodb, SiNodedotjs, SiReact, SiVite, SiFramer } from 'react-icons/si';
import { FaRoute, FaPalette, FaMousePointer } from 'react-icons/fa';
import './Technologies.css';

const Technologies = () => {
  const technologies = [
    // Frontend
    {
      name: "HTML",
      icon: SiHtml5,
      color: "#E34F26",
      category: "Frontend",
    },
    {
      name: "CSS",
      icon: SiCss3,
      color: "#1572B6",
      category: "Frontend",
    },
    {
      name: "React",
      icon: SiReact,
      color: "#61DAFB",
      category: "Frontend",
    },
    {
      name: "Vite",
      icon: SiVite,
      color: "#646CFF",
      category: "Build Tool",
    },
    {
      name: "Framer Motion",
      icon: SiFramer,
      color: "#FF6B6B",
      category: "Animation",
    },
    // Language
    {
      name: "JavaScript",
      icon: SiJavascript,
      color: "#F7DF1E",
      category: "Language",
    },
    // Backend
    {
      name: "Node.js",
      icon: SiNodedotjs,
      color: "#339933",
      category: "Backend",
    },
    // Database
    {
      name: "MongoDB",
      icon: SiMongodb,
      color: "#47A248",
      category: "Database",
    },
    // Tools
    {
      name: "Git",
      icon: SiGit,
      color: "#F05032",
      category: "Tools",
    },
    {
      name: "React Router",
      icon: FaRoute,
      color: "#CA4245",
      category: "Navigation",
    },
    {
      name: "React Icons",
      icon: FaPalette,
      color: "#FFD93D",
      category: "UI",
    },
    {
      name: "Smooth Scroll",
      icon: FaMousePointer,
      color: "#6BCF7F",
      category: "UX",
    },
  ];

  return (
    <section className="technologies" id="technologies">
      <div className="container">
        <motion.div
          className="technologies-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Technologies Maîtrisées</h2>
          <p className="section-subtitle">
            Des solutions techniques modernes pour vos projets
          </p>

          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="tech-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
              >
                <div className="tech-icon-wrapper" data-tech={tech.name}>
                  <tech.icon size={40} />
                </div>
                <h3>{tech.name}</h3>
                <span className="tech-category">{tech.category}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Technologies;
