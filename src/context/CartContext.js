import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

const buildLineId = (productId, color, size) => `${productId}::${color || 'default'}::${size || 'default'}`;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartToast, setCartToast] = useState({ visible: false, message: '', id: null });

  const addToCart = (product, options = {}) => {
    const selectedColor = options.color || product.colors?.[0] || null;
    const selectedSize = options.size || product.sizes?.[0] || null;
    const selectedQuantity = Math.max(1, Number(options.quantity) || 1);
    const lineId = buildLineId(product.id, selectedColor, selectedSize);

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.lineId === lineId);

      if (existingItem) {
        return prevItems.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          lineId,
          selectedColor,
          selectedSize,
          quantity: selectedQuantity,
        },
      ];
    });

    const messageBits = [
      `${selectedQuantity} x ${product.name}`,
      selectedColor ? `Color: ${selectedColor}` : null,
      selectedSize ? `Size: ${selectedSize}` : null,
    ].filter(Boolean);

    setCartToast({
      visible: true,
      message: `${messageBits.join(' | ')} added to cart`,
      id: Date.now(),
    });
  };

  const removeFromCart = (lineId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.lineId !== lineId));
  };

  const updateQuantity = (lineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(lineId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.lineId === lineId ? { ...item, quantity } : item))
    );
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + price * item.quantity;
    }, 0);

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  const clearCart = () => setCartItems([]);
  const hideCartToast = () => setCartToast((prev) => ({ ...prev, visible: false }));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getTotalItems,
        clearCart,
        cartToast,
        hideCartToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
