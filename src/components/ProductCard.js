import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const productUrl = `/product/${product.id}`;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const hasSale = product.salePrice && Number(product.salePrice) < Number(product.price);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl">
      <Link to={productUrl} className="flex flex-1 flex-col" aria-label={product.name}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-24 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-32"
            loading="lazy"
          />
        ) : (
          <div className="flex h-24 items-center justify-center bg-slate-100 text-[10px] font-medium text-slate-500 sm:h-32 sm:text-sm">No image available</div>
        )}
        <div className="flex flex-1 flex-col p-2 sm:p-3">
          <h4 className="mb-1 line-clamp-2 text-[11px] font-bold leading-tight text-slate-900 sm:text-base">{product.name}</h4>
          <p className="mb-2 hidden line-clamp-2 text-xs leading-relaxed text-slate-600 sm:block">{product.description}</p>

          {product.categories?.length > 0 && (
            <div className="mb-2 hidden flex-wrap gap-1.5 sm:flex">
              {product.categories.slice(0, 2).map((category) => (
                <span key={category} className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                  {category}
                </span>
              ))}
            </div>
          )}

          <div className="mb-2">
            {hasSale ? (
              <div className="flex items-end gap-2">
                <span className="text-[10px] text-slate-400 line-through sm:text-xs">${product.price}</span>
                <span className="text-sm font-extrabold text-slate-900 sm:text-xl">${product.salePrice}</span>
              </div>
            ) : (
              <span className="text-sm font-extrabold text-slate-900 sm:text-xl">${product.price}</span>
            )}
          </div>

        </div>
      </Link>
      <div className="px-2 pb-2 sm:px-3.5 sm:pb-3.5">
        <button
          onClick={handleAddToCart}
          className="w-full rounded-lg bg-slate-900 px-2 py-1.5 text-[10px] font-bold leading-none text-white transition hover:bg-red-700 sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs"
        >
          {t('product.addToCart')}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
