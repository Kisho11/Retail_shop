import React from 'react';
import Categories from '../components/Categories';

function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Elamshelf</h1>
      <p className="text-gray-700 mb-8">Your source for shop shelving and retail solutions.</p>
      <Categories />  {/* Embed categories here */}
    </div>
  );
}

export default Home;