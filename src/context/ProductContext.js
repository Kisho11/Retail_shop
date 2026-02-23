import React, { createContext, useContext, useMemo, useState } from 'react';
import initialProducts from '../data/products';

const ProductContext = createContext();

const initialCategories = [
  { name: 'Shop Shelving', image: '/wall-bays.jpg' },
  { name: 'Refrigeration', image: '/chiller.jpg' },
  { name: 'Displays', image: '/glass-counter.jpg' },
  { name: 'Flooring', image: '/flooring.jpg' },
  { name: 'Checkout', image: '/store-counter.jpg' },
  { name: 'Accessories', image: '/modular-shelf.jpg' },
  { name: 'Slatwall Panels', image: '/wall-bays.jpg' },
  { name: 'Off-Licence Fittings', image: '/store-counter.jpg' },
];

const getNowIso = () => new Date().toISOString();

const createDefaultInventory = (product) => {
  const base = (Number(product.id) || 1) * 7;
  const onHand = 40 + (base % 120);
  const reserved = base % 9;
  const reorderLevel = 18 + (base % 20);
  const reorderQty = 40 + (base % 60);
  const openingTimestamp = getNowIso();

  return {
    sku: `ELM-${String(product.id).padStart(4, '0')}`,
    onHand,
    reserved,
    reorderLevel,
    reorderQty,
    averageDailyUsage: 2 + (base % 6),
    location: `Aisle-${(base % 8) + 1}`,
    supplier: 'Default Supplier',
    leadTimeDays: 5 + (base % 5),
    lastAuditAt: openingTimestamp,
    lastUpdatedAt: openingTimestamp,
    movements: [
      {
        id: `${product.id}-init`,
        type: 'INIT',
        quantity: onHand,
        previousOnHand: 0,
        newOnHand: onHand,
        reason: 'Opening stock',
        actor: 'System',
        at: openingTimestamp,
      },
    ],
  };
};

const normalizeInventory = (product) => {
  const defaults = createDefaultInventory(product);
  const existing = product.inventory || {};
  const onHand = Number(existing.onHand ?? defaults.onHand);
  const reserved = Math.min(Number(existing.reserved ?? defaults.reserved), Math.max(onHand, 0));

  return {
    ...defaults,
    ...existing,
    onHand: Math.max(onHand, 0),
    reserved: Math.max(reserved, 0),
    reorderLevel: Math.max(Number(existing.reorderLevel ?? defaults.reorderLevel), 0),
    reorderQty: Math.max(Number(existing.reorderQty ?? defaults.reorderQty), 1),
    averageDailyUsage: Math.max(Number(existing.averageDailyUsage ?? defaults.averageDailyUsage), 0.1),
    leadTimeDays: Math.max(Number(existing.leadTimeDays ?? defaults.leadTimeDays), 1),
    movements: Array.isArray(existing.movements) && existing.movements.length > 0 ? existing.movements : defaults.movements,
    lastUpdatedAt: existing.lastUpdatedAt || defaults.lastUpdatedAt,
    lastAuditAt: existing.lastAuditAt || defaults.lastAuditAt,
  };
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() =>
    initialProducts.map((product) => ({
      ...product,
      inventory: normalizeInventory(product),
    }))
  );
  const [categories, setCategories] = useState(initialCategories);

  const categoryNames = useMemo(() => categories.map((c) => c.name), [categories]);

  const addProduct = (newProduct) => {
    const nextId = Math.max(...products.map((p) => p.id), 0) + 1;
    const productWithId = {
      ...newProduct,
      id: nextId,
    };
    productWithId.inventory = normalizeInventory(productWithId);
    setProducts([...products, productWithId]);
    return productWithId;
  };

  const updateProduct = (productId, updatedData) => {
    setProducts(
      products.map((p) => {
        if (p.id !== productId) return p;
        const merged = { ...p, ...updatedData };
        merged.inventory = normalizeInventory({
          ...p,
          inventory: {
            ...p.inventory,
            ...(updatedData.inventory || {}),
          },
        });
        return merged;
      })
    );
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const getProductById = (id) => products.find((p) => p.id === parseInt(id, 10));

  const getProductsByCategory = (category) => products.filter((p) => p.categories.includes(category));

  const addCategory = (categoryData) => {
    const payload =
      typeof categoryData === 'string'
        ? { name: categoryData.trim(), image: '' }
        : { name: categoryData.name?.trim() || '', image: categoryData.image?.trim() || '' };

    if (!payload.name) return false;

    const exists = categories.some((c) => c.name.toLowerCase() === payload.name.toLowerCase());
    if (exists) return false;

    setCategories([...categories, payload]);
    return true;
  };

  const deleteCategory = (categoryName) => {
    setCategories(categories.filter((c) => c.name !== categoryName));
  };

  const updateCategory = (oldName, updatedCategoryData) => {
    const payload =
      typeof updatedCategoryData === 'string'
        ? { name: updatedCategoryData.trim(), image: '' }
        : {
            name: updatedCategoryData.name?.trim() || oldName,
            image: updatedCategoryData.image?.trim() || '',
          };

    setProducts(
      products.map((p) => ({
        ...p,
        categories: p.categories.map((c) => (c === oldName ? payload.name : c)),
      }))
    );

    setCategories(
      categories.map((c) =>
        c.name === oldName
          ? {
              ...c,
              name: payload.name,
              image: payload.image || c.image,
            }
          : c
      )
    );
  };

  const getCategoryByName = (name) => categories.find((c) => c.name === name);

  const adjustStock = (productId, payload = {}) => {
    const { change = 0, reason = 'Manual stock update', actor = 'Manager', reference = '' } = payload;
    const quantityChange = Number(change);
    if (!quantityChange) return null;

    let movementRecord = null;
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) return product;

        const previousOnHand = Number(product.inventory?.onHand || 0);
        const newOnHand = Math.max(previousOnHand + quantityChange, 0);
        const actualChange = newOnHand - previousOnHand;
        const now = getNowIso();
        movementRecord = {
          id: `${product.id}-${Date.now()}`,
          type: actualChange >= 0 ? 'IN' : 'OUT',
          quantity: actualChange,
          previousOnHand,
          newOnHand,
          reason,
          actor,
          reference,
          at: now,
        };

        return {
          ...product,
          inventory: {
            ...product.inventory,
            onHand: newOnHand,
            reserved: Math.min(product.inventory?.reserved || 0, newOnHand),
            lastUpdatedAt: now,
            movements: [movementRecord, ...(product.inventory?.movements || [])].slice(0, 40),
          },
        };
      })
    );

    return movementRecord;
  };

  const getInventorySummary = () => {
    const totals = products.reduce(
      (acc, product) => {
        const onHand = Number(product.inventory?.onHand || 0);
        const reserved = Number(product.inventory?.reserved || 0);
        const available = Math.max(onHand - reserved, 0);
        acc.totalOnHand += onHand;
        acc.totalReserved += reserved;
        acc.totalAvailable += available;
        if (onHand <= 0) acc.outOfStock += 1;
        if (available <= Number(product.inventory?.reorderLevel || 0)) acc.lowStock += 1;
        return acc;
      },
      { totalOnHand: 0, totalReserved: 0, totalAvailable: 0, outOfStock: 0, lowStock: 0 }
    );
    return totals;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        categoryNames,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductsByCategory,
        addCategory,
        deleteCategory,
        updateCategory,
        getCategoryByName,
        adjustStock,
        getInventorySummary,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
}
