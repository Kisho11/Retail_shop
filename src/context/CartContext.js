import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext();

const normalizeAttributes = (attributes = {}) =>
  Object.fromEntries(
    Object.entries(attributes)
      .map(([key, value]) => [`${key || ''}`.trim(), `${value || ''}`.trim()])
      .filter(([key, value]) => key && value)
      .sort(([left], [right]) => left.localeCompare(right))
  );

const buildLineId = (productId, attributes = {}) => {
  const normalized = normalizeAttributes(attributes);
  const suffix = Object.entries(normalized)
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  return `${productId}::${suffix || 'default'}`;
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartToast, setCartToast] = useState({ visible: false, message: '', id: null });

  const addToCart = useCallback((product, options = {}) => {
    const selectedAttributes = normalizeAttributes(options.attributes || {});
    const selectedColor = selectedAttributes.Color || selectedAttributes.Colour || options.color || product.colors?.[0] || null;
    const selectedSize = selectedAttributes.Size || options.size || product.sizes?.[0] || null;
    const selectedQuantity = Math.max(1, Number(options.quantity) || 1);
    const lineId = buildLineId(product.id, selectedAttributes);

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
          selectedAttributes,
          selectedColor,
          selectedSize,
          quantity: selectedQuantity,
        },
      ];
    });

    const messageBits = [
      `${selectedQuantity} x ${product.name}`,
      ...Object.entries(selectedAttributes).map(([key, value]) => `${key}: ${value}`),
    ].filter(Boolean);

    setCartToast({
      visible: true,
      message: `${messageBits.join(' | ')} added to cart`,
      id: Date.now(),
    });
  }, []);

  const removeFromCart = useCallback((lineId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback(
    (lineId, quantity) => {
      if (quantity <= 0) {
        removeFromCart(lineId);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) => (item.lineId === lineId ? { ...item, quantity } : item))
      );
    },
    [removeFromCart]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce((total, item) => {
        const price = item.salePrice || item.price;
        return total + price * item.quantity;
      }, 0),
    [cartItems]
  );
  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );
  const getTotalPrice = useCallback(() => totalPrice, [totalPrice]);
  const getTotalItems = useCallback(() => totalItems, [totalItems]);

  const clearCart = useCallback(() => setCartItems([]), []);
  const hideCartToast = useCallback(() => setCartToast((prev) => ({ ...prev, visible: false })), []);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems,
      clearCart,
      cartToast,
      hideCartToast,
      totalPrice,
      totalItems,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems,
      clearCart,
      cartToast,
      hideCartToast,
      totalPrice,
      totalItems,
    ]
  );

  return (
    <CartContext.Provider value={value}>
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
