import React from 'react';
import BackButton from '../components/BackButton';
import Seo from '../components/Seo';

function Showroom() {
  return (
    <div className="container mx-auto py-8">
      <Seo
        title="Showroom"
        description="Visit the Elmshelf showroom to explore retail shelving, displays, counters, and shopfitting solutions in person."
      />
      <BackButton className="mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Our Extensive Showroom</h1>
      <p className="text-gray-700">Details about our showroom location and hours.</p>
      {/* Add map, images, or hours here later */}
    </div>
  );
}

export default Showroom;
