import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';

function ProductManagement() {
  const { products, categoryNames, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    categories: [],
    industries: [],
    image: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const industriesOptions = [
    'Tech shops', 'DIY', 'Greengrocer', 'Pound shop', 'Pet shop', 'Vape shop',
    'Grocery store', 'Butcher', 'Organic shops', 'Pharmacy store', 'Restaurants', 'Bakery'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      salePrice: '',
      categories: [],
      industries: [],
      image: '',
    });
    setEditingId(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryToggle = (cat) => {
    setFormData({
      ...formData,
      categories: formData.categories.includes(cat)
        ? formData.categories.filter(c => c !== cat)
        : [...formData.categories, cat]
    });
  };

  const handleIndustryToggle = (ind) => {
    setFormData({
      ...formData,
      industries: formData.industries.includes(ind)
        ? formData.industries.filter(i => i !== ind)
        : [...formData.industries, ind]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.description.trim() || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.categories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    if (editingId) {
      updateProduct(editingId, formData);
      setSuccess('Product updated successfully!');
    } else {
      addProduct(formData);
      setSuccess('Product added successfully!');
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowAddForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      setSuccess('Product deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-primary">📦 Product Management</h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition"
          >
            + Add New Product
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h4 className="text-2xl font-bold text-gray-800 mb-6">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h4>

          {error && (
            <div className="bg-blue-50 border-2 border-blue-500 text-blue-700 p-4 rounded-lg mb-6">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-lg mb-6">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price $*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Sale Price $ (optional)</label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="/image-name.jpg"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Select Categories *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categoryNames.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Select Industries (optional)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {industriesOptions.map((ind) => (
                  <label key={ind} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.industries.includes(ind)}
                      onChange={() => handleIndustryToggle(ind)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-gray-700 text-sm">{ind}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4 border-t-2 border-gray-200">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
              >
                {editingId ? '💾 Update Product' : '✓ Add Product'}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowAddForm(false);
                }}
                className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-6">All Products ({products.length})</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Price</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Categories</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">{product.name}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-accent">${product.price}</span>
                    {product.salePrice && (
                      <span className="text-sm text-gray-600 ml-2 line-through">${product.salePrice}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {product.categories.slice(0, 2).map((cat) => (
                        <span key={cat} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {cat}
                        </span>
                      ))}
                      {product.categories.length > 2 && (
                        <span className="text-gray-600 text-xs">+{product.categories.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;
