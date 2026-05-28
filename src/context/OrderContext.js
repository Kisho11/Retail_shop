import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const OrderContext = createContext();
const ORDERS_STORAGE_KEY = 'orders';

const initialOrders = [
  { id: 1001, customer: 'John Smith', amount: 450.0, status: 'Shipped', date: '2026-02-22', items: [] },
  { id: 1002, customer: 'Emma Wilson', amount: 320.5, status: 'Processing', date: '2026-02-22', items: [] },
  { id: 1003, customer: 'Mike Johnson', amount: 890.0, status: 'Delivered', date: '2026-02-21', items: [] },
  { id: 1004, customer: 'Sarah Davis', amount: 220.75, status: 'Pending', date: '2026-02-21', items: [] },
  { id: 1005, customer: 'Tom Brown', amount: 1500.0, status: 'Shipped', date: '2026-02-20', items: [] },
];

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
};

const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatTime = (date) => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

const normalizeOrder = (order) => {
  const amount = Number(order.amount || order.pricing?.total || 0);
  const subtotal = Number(order.pricing?.subtotal ?? amount / 1.1);
  const taxRate = Number(order.pricing?.taxRate ?? 0.1);
  const taxAmount = Number(order.pricing?.taxAmount ?? subtotal * taxRate);
  const shippingFee = Number(order.pricing?.shippingFee ?? 0);
  const createdAt = order.createdAt || new Date(`${order.date || formatDate(new Date())}T12:00:00`).toISOString();
  const createdDate = new Date(createdAt);

  return {
    ...order,
    customerFirstName: order.customerFirstName || '',
    customerLastName: order.customerLastName || '',
    customer: order.customer || 'Unknown Customer',
    customerEmail: order.customerEmail || '',
    customerPhone: order.customerPhone || '',
    shippingAddress: {
      address: order.shippingAddress?.address || '',
      city: order.shippingAddress?.city || '',
      state: order.shippingAddress?.state || '',
      zipCode: order.shippingAddress?.zipCode || '',
    },
    items: Array.isArray(order.items) ? order.items : [],
    amount,
    pricing: {
      subtotal,
      taxRate,
      taxAmount,
      shippingFee,
      total: amount,
    },
    payment: {
      method: order.payment?.method || 'Card',
      cardLast4: order.payment?.cardLast4 || '',
      expiryDate: order.payment?.expiryDate || '',
    },
    status: order.status || 'Pending',
    date: order.date || formatDate(createdDate),
    orderTime: order.orderTime || formatTime(createdDate),
    createdAt,
    source: order.source || 'web_checkout',
  };
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() =>
    readStorage(ORDERS_STORAGE_KEY, initialOrders).map((order) => normalizeOrder(order))
  );

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const placeOrder = useCallback((payload) => {
    const now = new Date();
    const maxId = orders.reduce((max, order) => Math.max(max, Number(order.id) || 0), 1000);
    const newOrder = normalizeOrder({
      id: maxId + 1,
      customerFirstName: payload.customerFirstName || '',
      customerLastName: payload.customerLastName || '',
      customer: payload.customer,
      customerEmail: payload.customerEmail || '',
      customerPhone: payload.customerPhone || '',
      shippingAddress: payload.shippingAddress || {},
      items: payload.items || [],
      amount: Number(payload.amount) || 0,
      pricing: payload.pricing || {},
      payment: payload.payment || {},
      status: 'Pending',
      date: formatDate(now),
      orderTime: formatTime(now),
      createdAt: now.toISOString(),
      source: 'web_checkout',
    });

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, [orders]);

  const value = useMemo(
    () => ({
      orders,
      placeOrder,
    }),
    [orders, placeOrder]
  );

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
}
