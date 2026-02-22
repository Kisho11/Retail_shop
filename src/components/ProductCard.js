import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const hasSale = product.salePrice && Number(product.salePrice) < Number(product.price);

  return (
    <Link to={`/product/${product.id}`}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-52 overflow-hidden bg-slate-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-medium text-slate-500">No image available</div>
          )}
          {hasSale && (
            <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase text-white">
              On Sale
            </span>
          )}
          {product.modelUrl && (
            <span className="absolute bottom-3 right-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase text-white">
              3D
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h4 className="mb-2 line-clamp-2 text-lg font-bold text-slate-900">{product.name}</h4>
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{product.description}</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {product.categories?.slice(0, 2).map((cat) => (
              <span key={cat} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {cat}
              </span>
            ))}
          </div>

          <div className="mb-4">
            {hasSale ? (
              <div className="flex items-end gap-2">
                <span className="text-sm text-slate-400 line-through">${product.price}</span>
                <span className="text-2xl font-extrabold text-slate-900">${product.salePrice}</span>
              </div>
            ) : (
              <span className="text-2xl font-extrabold text-slate-900">${product.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-auto rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Add to cart
          </button>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;
