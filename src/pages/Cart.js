import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';

function ShoppingCart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="shell py-16 text-center">
        <BackButton className="mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Shopping Cart</h1>
        <p className="text-lg text-slate-600 mb-8">Your cart is empty</p>
        <Link
          to="/"
          className="rounded-lg bg-slate-900 px-8 py-3 font-semibold text-white hover:bg-red-700 transition inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-8">
      <BackButton className="mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1">
            {cartItems.map((item) => (
              <div
                key={item.lineId}
                className="flex flex-col gap-3 bg-white p-3 rounded-xl shadow transition hover:shadow-lg sm:gap-4 sm:p-6 lg:flex-row"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-full object-cover rounded-lg sm:h-28 sm:w-28"
                  />
                )}

                <div className="flex-1">
                  <Link
                    to={`/product/${item.id}`}
                    className="text-sm font-bold text-slate-900 transition hover:text-blue-700 sm:text-xl"
                  >
                    {item.name}
                  </Link>
                  <p className="mb-2 text-xs text-slate-600 sm:mb-3 sm:text-sm">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.selectedColor && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 sm:px-3 sm:py-1 sm:text-xs">
                        Color: {item.selectedColor}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 sm:px-3 sm:py-1 sm:text-xs">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>
                  <p className="text-blue-700 font-bold text-sm sm:text-lg">${item.salePrice || item.price} each</p>
                </div>

                <div className="flex flex-col items-start justify-between gap-3 sm:items-end">
                  <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg sm:gap-3 sm:p-2">
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                      className="px-2 py-1 bg-slate-300 rounded hover:bg-slate-400 font-bold sm:px-3"
                    >
                      −
                    </button>
                    <span className="w-7 text-center font-bold text-sm sm:w-8 sm:text-base">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      className="px-2 py-1 bg-slate-300 rounded hover:bg-slate-400 font-bold sm:px-3"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-1 text-left sm:mt-4 sm:text-right">
                    <p className="text-lg font-bold text-slate-900 sm:text-2xl">
                      ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.lineId)}
                      className="text-blue-500 hover:text-blue-700 text-xs mt-1 underline font-semibold sm:mt-3 sm:text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-blue-700 hover:text-blue-500 mt-8 font-semibold transition"
          >
            ← Continue Shopping
          </button>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-lg h-fit sticky top-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Summary</h2>

          <div className="space-y-4 border-b border-slate-200 pb-4 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-semibold text-slate-900">${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Shipping:</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tax (10%):</span>
              <span className="font-semibold text-slate-900">${(getTotalPrice() * 0.1).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between text-2xl font-bold text-slate-900 mb-6 bg-slate-50 p-4 rounded-lg">
            <span>Total:</span>
            <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full rounded-lg bg-slate-900 text-white py-3 px-4 font-bold hover:bg-red-700 transition mb-4"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full border border-slate-300 text-slate-700 py-3 px-4 rounded-lg font-semibold hover:bg-slate-100 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
