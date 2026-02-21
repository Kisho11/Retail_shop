import React from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products';  // Import shared data
import ProductCard from '../components/ProductCard';

function ProductsByIndustry() {
  const { industry } = useParams();  // e.g., 'tech-shops'
  const formattedIndustry = industry ? industry.replace('-', ' ') : null;

  // Filter products by industry
  const filteredProducts = formattedIndustry
    ? products.filter(p => p.industries.some(ind => ind.toLowerCase() === formattedIndustry.toLowerCase()))
    : products;  // Show all if no specific industry

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-primary mb-4">Products by Industry</h1>
      {formattedIndustry ? (
        <p className="text-gray-700 mb-8">Showing products tailored for: {formattedIndustry}</p>
      ) : (
        <p className="text-gray-700 mb-8">Browse products by specific industries using the menu.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-700">No products found for this industry.</p>
        )}
      </div>
    </div>
  );
}

export default ProductsByIndustry;