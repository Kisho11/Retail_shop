import React from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products';
import ProductCard from '../components/ProductCard';

function ProductsByIndustry() {
  const { industry } = useParams();
  const formattedIndustry = industry ? decodeURIComponent(industry).replace(/-/g, ' ') : null;

  const filteredProducts = formattedIndustry
    ? products.filter((p) =>
        p.industries?.some((ind) => ind.toLowerCase() === formattedIndustry.toLowerCase())
      )
    : products;

  return (
    <section className="shell py-10">
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Industry catalog</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Products by Industry</h1>
        {formattedIndustry ? (
          <p className="mt-3 text-slate-600">Showing products for <span className="font-semibold text-slate-900">{formattedIndustry}</span>.</p>
        ) : (
          <p className="mt-3 text-slate-600">Select an industry from navigation to narrow product recommendations.</p>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          No products found for this industry yet.
        </div>
      )}
    </section>
  );
}

export default ProductsByIndustry;
