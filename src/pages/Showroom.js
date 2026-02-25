import React from 'react';
import BackButton from '../components/BackButton';

function Showroom() {
  return (
    <div className="container mx-auto py-8">
      <BackButton className="mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Our Extensive Showroom</h1>
      <p className="text-gray-700">Details about our showroom location and hours.</p>
      {/* Add map, images, or hours here later */}
    </div>
  );
}

export default Showroom;
