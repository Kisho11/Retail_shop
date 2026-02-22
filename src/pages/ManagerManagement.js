import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function ManagerManagement() {
  const { managers, addManager, updateManager, deleteManager } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      phone: '',
    });
    setEditingId(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if email already exists (when adding new manager)
    if (!editingId && managers.some(m => m.email === formData.email)) {
      setError('A manager with this email already exists');
      return;
    }

    if (editingId) {
      updateManager(editingId, formData);
      setSuccess('Manager updated successfully!');
    } else {
      addManager(formData);
      setSuccess('Manager added successfully!');
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (manager) => {
    setFormData({
      email: manager.email,
      name: manager.name,
      phone: manager.phone,
    });
    setEditingId(manager.id);
    setShowAddForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = (managerId) => {
    if (window.confirm('Are you sure you want to delete this manager? This action cannot be undone.')) {
      deleteManager(managerId);
      setSuccess('Manager deleted successfully!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-primary">👨‍💼 Manager Management</h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition"
          >
            + Add New Manager
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h4 className="text-2xl font-bold text-gray-800 mb-6">
            {editingId ? 'Edit Manager' : 'Add New Manager'}
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
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Manager Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., John Smith"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>📝 Note:</strong> New managers will need to use their email as username at login. 
                They can change their password after first login.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4 border-t-2 border-gray-200">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
              >
                {editingId ? '💾 Update Manager' : '✓ Add Manager'}
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

      {/* Managers List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-6">All Managers ({managers.length})</h4>
        
        {managers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No managers yet. Add your first manager to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Joined</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((manager) => (
                  <tr key={manager.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-800">{manager.name}</td>
                    <td className="px-6 py-4 text-gray-700">{manager.email}</td>
                    <td className="px-6 py-4 text-gray-700">{manager.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        manager.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {manager.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {formatDate(manager.joinDate)}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(manager)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(manager.id)}
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
        )}
      </div>

      {/* Demo Credentials Info */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
        <h4 className="text-lg font-bold text-amber-900 mb-3">ℹ️ Manager Access Information</h4>
        <div className="space-y-2 text-sm text-amber-900">
          <p><strong>Existing Test Manager:</strong> manager@elamshelf.com / manager123</p>
          <p><strong>For New Managers:</strong> Email address becomes their login username. They should reset their password on first login.</p>
        </div>
      </div>
    </div>
  );
}

export default ManagerManagement;
