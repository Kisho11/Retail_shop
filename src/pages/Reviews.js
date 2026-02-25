import React from 'react';
import BackButton from '../components/BackButton';

function Reviews() {
  return (
    <div className="container mx-auto py-8">
      <BackButton className="mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Our Reviews</h1>
      <p className="text-gray-700">Customer testimonials and feedback.</p>
      {/* Add review cards here later */}
    </div>
  );
}

export default Reviews;
