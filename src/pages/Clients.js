import React from 'react';
import BackButton from '../components/BackButton';
import Seo from '../components/Seo';

function Clients() {
  return (
    <div className="container mx-auto py-8">
      <Seo
        title="Clients"
        description="See the kinds of retailers and business partners Elmshelf supports with shelving, displays, counters, and fit-out solutions."
      />
      <BackButton className="mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Our Clients</h1>
      <p className="text-gray-700">Showcasing our partnerships and clients.</p>
      {/* Add client logos or lists here later */}
    </div>
  );
}

export default Clients;
