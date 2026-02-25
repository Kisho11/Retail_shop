import React from 'react';
import BackButton from '../components/BackButton';

function Clients() {
  return (
    <div className="container mx-auto py-8">
      <BackButton className="mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Our Clients</h1>
      <p className="text-gray-700">Showcasing our partnerships and clients.</p>
      {/* Add client logos or lists here later */}
    </div>
  );
}

export default Clients;
