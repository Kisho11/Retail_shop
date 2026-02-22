import React, { createContext, useContext, useState } from 'react';
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

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);

  const categoryNames = categories.map((c) => c.name);

  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
    };
    setProducts([...products, productWithId]);
    return productWithId;
  };

  const updateProduct = (productId, updatedData) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, ...updatedData } : p)));
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
