import React from 'react';
import products from '../data/products';  // Import shared data
import ProductCard from './ProductCard';

// Mock catalogues (unchanged)
const catalogues = [
  { name: 'Wall Bays Catalogue', url: '/downloads/wall-bays.pdf' },
  { name: 'Slatwall Panel Catalogue', url: '/downloads/slatwall.pdf' },
  { name: 'Bakery & Bread Catalogue', url: '/downloads/bakery.pdf' },
  { name: 'Refrigeration Catalogue', url: '/downloads/refrigeration.pdf' },
];

// Derive unique categories from products
const uniqueCategories = [...new Set(products.flatMap(p => p.categories))];

function Categories() {
  return (
    <section className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-primary mb-6">Product Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueCategories.map((category, index) => {
          const categoryProducts = products.filter(p => p.categories.includes(category));
          return (
            <div key={index} className="bg-gray-100 p-4 rounded">
              <h3 className="text-xl font-semibold text-accent mb-4">{category}</h3>
              <div className="grid grid-cols-1 gap-4">
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <h2 className="text-3xl font-bold text-primary mt-12 mb-6">Catalogues</h2>
      <ul className="space-y-4">
        {catalogues.map((cat, index) => (
          <li key={index}>
            <a href={cat.url} download className="text-accent hover:underline">{cat.name} (Download)</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Categories;