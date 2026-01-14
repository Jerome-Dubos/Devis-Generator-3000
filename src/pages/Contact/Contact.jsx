import React from 'react';
import Banner from '../../components/Contact/Banner/Banner';
import ContactInfo from '../../components/Contact/ContactInfo/ContactInfo';
import ContactForm from '../../components/Contact/ContactForm/ContactForm';
import './Contact.css';

const Contact = () => {

  return (
    <div className="contact-container" id="contact">
      <Banner />
      
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
