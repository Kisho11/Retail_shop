import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const formatPriceRange = (product) => {
  const minPrice = Number(product.minPrice);
  const maxPrice = Number(product.maxPrice);
  const basePrice = Number(product.price);

  if (Number.isFinite(minPrice) && Number.isFinite(maxPrice) && maxPrice >= minPrice) {
    if (minPrice === maxPrice) {
      return `£${minPrice}`;
    }
    return `£${minPrice} - £${maxPrice}`;
  }

  if (Number.isFinite(basePrice)) {
    return `£${basePrice}`;
  }

  return '£0';
};

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const productUrl = `/product/${product.id}`;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl">
      <Link to={productUrl} className="flex flex-1 flex-col" aria-label={product.name}>
        {product.image ? (
          <div className="flex h-24 w-full items-center justify-center bg-slate-50 p-2 sm:h-32 sm:p-3">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center bg-slate-100 text-[10px] font-medium text-slate-500 sm:h-32 sm:text-sm">No image available</div>
        )}
        <div className="flex flex-1 flex-col p-2 sm:p-3">
          <h4 className="mb-2 line-clamp-2 text-[11px] font-bold leading-tight text-slate-900 sm:text-base">{product.name}</h4>
          <div className="mb-2">
            <span className="text-sm font-extrabold text-slate-900 sm:text-xl">{formatPriceRange(product)}</span>
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
