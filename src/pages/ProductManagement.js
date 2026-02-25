import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import UiIcon from '../components/UiIcon';

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
    imageCount: 1,
    imageUrls: [''],
    mainImageIndex: 0,
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
      imageCount: 1,
      imageUrls: [''],
      mainImageIndex: 0,
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

  const handleImageCountChange = (value) => {
    const parsed = Math.max(1, Math.min(12, Number(value) || 1));
    setFormData((prev) => {
      const nextUrls = [...prev.imageUrls];
      if (parsed > nextUrls.length) {
        for (let i = nextUrls.length; i < parsed; i += 1) nextUrls.push('');
      } else {
        nextUrls.length = parsed;
      }
      const nextMainIndex = Math.min(prev.mainImageIndex, parsed - 1);
      return {
        ...prev,
        imageCount: parsed,
        imageUrls: nextUrls,
        mainImageIndex: nextMainIndex,
      };
    });
  };

  const handleImageUrlChange = (index, value) => {
    setFormData((prev) => {
      const nextUrls = [...prev.imageUrls];
      nextUrls[index] = value;
      return { ...prev, imageUrls: nextUrls };
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

    const imageUrls = formData.imageUrls.map((url) => url.trim());
    if (imageUrls.length === 0 || imageUrls.some((url) => !url)) {
      setError('Please provide all image URLs and select a main image');
      return;
    }

    const mainImage = imageUrls[formData.mainImageIndex] || imageUrls[0];
    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      salePrice: formData.salePrice,
      categories: formData.categories,
      industries: formData.industries,
      image: mainImage,
      galleryImages: imageUrls.filter((_, idx) => idx !== formData.mainImageIndex),
      imageCount: imageUrls.length,
    };

    if (editingId) {
      updateProduct(editingId, payload);
      setSuccess('Product updated successfully!');
    } else {
      addProduct(payload);
      setSuccess('Product added successfully!');
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (product) => {
    const imageUrls = [product.image, ...(product.galleryImages || [])].filter(Boolean);
    const safeUrls = imageUrls.length > 0 ? imageUrls : [''];
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      salePrice: product.salePrice || '',
      categories: product.categories || [],
      industries: product.industries || [],
      imageCount: safeUrls.length,
      imageUrls: safeUrls,
      mainImageIndex: 0,
    });
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
        <h3 className="flex items-center gap-2 text-2xl font-bold text-primary">
          <UiIcon name="box" className="h-6 w-6" />
          Product Management
        </h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"
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
            <div className="bg-blue-50 border-2 border-blue-500 text-blue-700 p-4 rounded-lg mb-6 inline-flex items-center gap-2">
              <UiIcon name="alert" className="h-5 w-5" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-lg mb-6 inline-flex items-center gap-2">
              <UiIcon name="check" className="h-5 w-5" />
              {success}
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
              <label className="block text-gray-700 font-semibold mb-2">Number of Images</label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.imageCount}
                onChange={(e) => handleImageCountChange(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">If you set 8, this product will show 8 images in single product view.</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Product Images (Select Main Image)</label>
              <div className="space-y-3">
                {formData.imageUrls.map((url, idx) => (
                  <div key={`image-url-${idx}`} className="rounded-lg border border-gray-200 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-700">Image {idx + 1}</p>
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <input
                          type="radio"
                          name="main-image"
                          checked={formData.mainImageIndex === idx}
                          onChange={() => setFormData((prev) => ({ ...prev, mainImageIndex: idx }))}
                        />
                        Main image
                      </label>
                    </div>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                      placeholder={`/image-${idx + 1}.jpg`}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                    />
                  </div>
                ))}
              </div>
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
                className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-red-800 transition"
              >
                <span className="inline-flex items-center gap-2">
                  <UiIcon name={editingId ? 'save' : 'check'} className="h-4 w-4" />
                  {editingId ? 'Update Product' : 'Add Product'}
                </span>
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
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Images</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Stock</th>
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
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {1 + (product.galleryImages?.length || 0)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{product.inventory?.onHand ?? 0}</p>
                    <p className="text-xs text-gray-500">
                      Avl: {Math.max((product.inventory?.onHand ?? 0) - (product.inventory?.reserved ?? 0), 0)}
                    </p>
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
                    {Math.max((product.inventory?.onHand ?? 0) - (product.inventory?.reserved ?? 0), 0) <= 0 ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                        Out of Stock
                      </span>
                    ) : Math.max((product.inventory?.onHand ?? 0) - (product.inventory?.reserved ?? 0), 0) <= (product.inventory?.reorderLevel ?? 0) ? (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Healthy
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      <span className="inline-flex items-center gap-1">
                        <UiIcon name="edit" className="h-4 w-4" />
                        Edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      <span className="inline-flex items-center gap-1">
                        <UiIcon name="trash" className="h-4 w-4" />
                        Delete
                      </span>
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
