import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

function CartToast() {
  const { cartToast, hideCartToast } = useCart();

  useEffect(() => {
    if (!cartToast.visible) return undefined;

    const timer = setTimeout(() => {
      hideCartToast();
    }, 2200);

    return () => clearTimeout(timer);
  }, [cartToast.visible, cartToast.id, hideCartToast]);

  if (!cartToast.visible) return null;

  return (
    <div className="fixed right-4 top-20 z-[90] w-[min(92vw,420px)]">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-xl backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-emerald-800">Added to cart</p>
            <p className="mt-1 text-sm text-emerald-700">{cartToast.message}</p>
          </div>
          <button
            onClick={hideCartToast}
            className="rounded-md px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            aria-label="Close notification"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartToast;
