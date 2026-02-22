import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ShoppingCart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="shell py-16 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Shopping Cart</h1>
        <p className="text-lg text-slate-600 mb-8">Your cart is empty</p>
        <Link
          to="/"
          className="rounded-lg bg-slate-900 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.lineId}
                className="flex gap-4 bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                )}

                <div className="flex-1">
                  <Link
                    to={`/product/${item.id}`}
                    className="text-xl font-bold text-slate-900 hover:text-blue-700 transition"
                  >
                    {item.name}
                  </Link>
                  <p className="text-slate-600 text-sm mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.selectedColor && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        Color: {item.selectedColor}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>
                  <p className="text-blue-700 font-bold text-lg">${item.salePrice || item.price} each</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                      className="px-3 py-1 bg-slate-300 rounded hover:bg-slate-400 font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      className="px-3 py-1 bg-slate-300 rounded hover:bg-slate-400 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right mt-4">
                    <p className="text-2xl font-bold text-slate-900">
                      ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.lineId)}
                      className="text-blue-500 hover:text-blue-700 text-sm mt-3 underline font-semibold"
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
            className="w-full rounded-lg bg-slate-900 text-white py-3 px-4 font-bold hover:bg-blue-700 transition mb-4"
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
