import React from 'react';
import { motion } from 'framer-motion';
import Banner from '../../components/Home/Banner/Banner';
import Services from '../../components/Home/Services/Services';
import Technologies from '../../components/Home/Technologies/Technologies';
import Testimonials from '../../components/Home/Testimonials/Testimonials';
import CallToAction from '../../components/Home/CallToAction/CallToAction';
import './Home.css';

const Home = () => {
  return (
    <main className="home">
      <Banner />
      
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Technologies />
      </motion.section>
      
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Services />
      </motion.section>
      
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Testimonials />
      </motion.section>
      
      <motion.section
        className="cta-section-wrapper"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <CallToAction />
      </motion.section>
    </main>
  );
};

export default Home;
