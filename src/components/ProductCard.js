import React from 'react';

function ProductCard({ product }) {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg flex flex-col items-center">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover mb-4 rounded"
          loading="lazy"
        />
      )}
      <h4 className="text-lg font-bold text-primary mb-1">{product.name}</h4>
      <p className="text-gray-600 text-sm mb-2 text-center">{product.description}</p>
      <div className="text-accent font-semibold">
        {product.salePrice ? (
          <>
            <span className="line-through text-gray-500 mr-2">${product.price}</span>
            ${product.salePrice}
          </>
        ) : (
          <>${product.price}</>
        )}
      </div>
    </div>
  );
}

export default ProductCard;