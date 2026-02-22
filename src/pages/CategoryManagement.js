import React, { useMemo, useState } from 'react';
import { useProducts } from '../context/ProductContext';

function CategoryManagement() {
  const { categories, addCategory, deleteCategory, updateCategory } = useProducts();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');

  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const normalizedNames = useMemo(() => categories.map((c) => c.name.toLowerCase()), [categories]);

  const handleAddCategory = () => {
    setError('');
    setSuccess('');

    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    if (normalizedNames.includes(newCategoryName.trim().toLowerCase())) {
      setError('Category already exists');
      return;
    }

    const result = addCategory({
      name: newCategoryName,
      image: newCategoryImage,
    });

    if (result) {
      setSuccess(`Category "${newCategoryName}" added successfully!`);
      setNewCategoryName('');
      setNewCategoryImage('');
    }
  };

  const handleUpdateCategory = (oldName) => {
    setError('');
    setSuccess('');

    if (!editName.trim()) {
      setError('Category name is required');
      return;
    }

    const duplicate = categories.some(
      (c) => c.name.toLowerCase() === editName.trim().toLowerCase() && c.name !== oldName
    );

    if (duplicate) {
      setError('Category already exists');
      return;
    }

    updateCategory(oldName, { name: editName, image: editImage });
    setSuccess(`Category updated to "${editName}"!`);
    setEditingCategory(null);
    setEditName('');
    setEditImage('');
  };

  const handleDeleteCategory = (categoryName) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      deleteCategory(categoryName);
      setSuccess(`Category "${categoryName}" deleted successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary mb-6">📁 Category Management</h3>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h4 className="font-bold text-lg text-gray-800 mb-4">Add New Category</h4>

          {error && (
            <div className="bg-blue-50 border-2 border-blue-500 text-blue-700 p-4 rounded-lg mb-4">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-lg mb-4">
              ✓ {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              value={newCategoryImage}
              onChange={(e) => setNewCategoryImage(e.target.value)}
              placeholder="Category image URL (e.g., /wall-bays.jpg)"
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
            />
            <button
              onClick={handleAddCategory}
              className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition"
            >
              + Add
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.name} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              {editingCategory === category.name ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border-2 border-primary rounded-lg px-3 py-2 focus:outline-none"
                    autoFocus
                    placeholder="Category name"
                  />
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="Category image URL"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateCategory(category.name)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setEditName('');
                        setEditImage('');
                      }}
                      className="flex-1 bg-gray-400 text-white px-3 py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-3 h-28 overflow-hidden rounded-lg bg-slate-100">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-500">No image</div>
                    )}
                  </div>
                  <h5 className="text-lg font-bold text-gray-800 mb-4">📂 {category.name}</h5>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category.name);
                        setEditName(category.name);
                        setEditImage(category.image || '');
                      }}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.name)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryManagement;
