import React from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import GlassCard from '../../GlassCard/GlassCard';
import GlassInput from '../../GlassInput/GlassInput';
import './ClientInfo.css';

const ClientInfo = () => {
  const { quoteData, updateClient } = useQuote();
  const { client } = quoteData;

  const handleChange = (field) => (e) => {
    updateClient(field, e.target.value);
  };

  return (
    <GlassCard variant="default" className="client-info">
      <h2 className="section-title">Informations Client</h2>
      <p className="section-subtitle">Renseignez les informations de votre client</p>

      <div className="client-form-grid">
        <GlassInput
          label="Nom / Raison sociale"
          value={client.name}
          onChange={handleChange('name')}
          placeholder="Nom du client ou raison sociale"
          required
        />

        <GlassInput
          label="Adresse"
          value={client.address}
          onChange={handleChange('address')}
          placeholder="Numéro et nom de rue"
        />

        <GlassInput
          label="Code postal"
          type="text"
          value={client.postalCode}
          onChange={handleChange('postalCode')}
          placeholder="75001"
        />

        <GlassInput
          label="Ville"
          value={client.city}
          onChange={handleChange('city')}
          placeholder="Paris"
        />

        <GlassInput
          label="Téléphone"
          type="tel"
          value={client.phone}
          onChange={handleChange('phone')}
          placeholder="+33 1 23 45 67 89"
        />

        <GlassInput
          label="Email"
          type="email"
          value={client.email}
          onChange={handleChange('email')}
          placeholder="client@exemple.fr"
        />
      </div>
    </GlassCard>
  );
};

export default ClientInfo;
