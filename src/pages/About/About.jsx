import React from 'react';
import Banner from '../../components/About/Banner/Banner';
import Stats from '../../components/About/Stats/Stats';
import Values from '../../components/About/Values/Values';
import Team from '../../components/About/Team/Team';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <Banner />
      <Stats />
      <Values />
      <Team />
    </div>
  );
};

export default About;
