import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import products from '../data/products';

function ManagerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  // Mock data for manager (limited view)
  const stats = {
    totalOrders: 1250,
    pendingOrders: 24,
    lowStockProducts: 8,
    pendingReviews: 12,
  };

  const recentOrders = [
    { id: 1001, customer: 'John Smith', amount: 450.00, status: 'Shipped', date: '2026-02-22' },
    { id: 1002, customer: 'Emma Wilson', amount: 320.50, status: 'Processing', date: '2026-02-22' },
    { id: 1003, customer: 'Mike Johnson', amount: 890.00, status: 'Delivered', date: '2026-02-21' },
    { id: 1004, customer: 'Sarah Davis', amount: 220.75, status: 'Pending', date: '2026-02-21' },
    { id: 1005, customer: 'Tom Brown', amount: 1500.00, status: 'Shipped', date: '2026-02-20' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-300">👩‍💻 Manager Dashboard</h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-blue-100">Logged in as</p>
              <p className="font-bold">{user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-4xl font-bold text-blue-700 mt-2">{stats.totalOrders}</p>
              </div>
              <span className="text-4xl">📋</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Pending Orders</p>
                <p className="text-4xl font-bold text-blue-700 mt-2">{stats.pendingOrders}</p>
              </div>
              <span className="text-4xl">⏳</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Low Stock Items</p>
                <p className="text-4xl font-bold text-yellow-700 mt-2">{stats.lowStockProducts}</p>
              </div>
              <span className="text-4xl">⚠️</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Pending Reviews</p>
                <p className="text-4xl font-bold text-purple-700 mt-2">{stats.pendingReviews}</p>
              </div>
              <span className="text-4xl">⭐</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto border-b border-gray-300 pb-4">
          {['orders', 'inventory', 'tasks'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-blue-700">📋 Order Management</h3>
              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                  ✓ Mark Complete
                </button>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
                  📦 Update Shipping
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-blue-700">#{order.id}</td>
                      <td className="px-6 py-4">{order.customer}</td>
                      <td className="px-6 py-4 font-semibold">${order.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.date}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 font-semibold">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-blue-700">📦 Inventory Management</h3>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition">
                + Update Stock
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Product</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Stock</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 8).map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold">{product.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.random() * 100}%`}}></div>
                          </div>
                          <span className="text-sm font-semibold">{Math.floor(Math.random() * 100)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {Math.random() > 0.3 ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            ✓ In Stock
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            ⚠️ Low
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 font-semibold">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-blue-700">✅ My Tasks</h3>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition">
                + New Task
              </button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Process pending orders', priority: 'High', due: '2026-02-22', status: 'In Progress' },
                { title: 'Update inventory levels', priority: 'Medium', due: '2026-02-23', status: 'Not Started' },
                { title: 'Handle customer complaints', priority: 'High', due: '2026-02-22', status: 'In Progress' },
                { title: 'Review low stock items', priority: 'Medium', due: '2026-02-24', status: 'Not Started' },
                { title: 'Prepare shipping labels', priority: 'Low', due: '2026-02-25', status: 'Completed' },
              ].map((task, idx) => (
                <div key={idx} className="border-2 border-gray-200 p-4 rounded-lg hover:shadow-md transition flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">{task.title}</h4>
                    <div className="flex gap-4 mt-2">
                      <span className={`text-sm px-2 py-1 rounded ${
                        task.priority === 'High' ? 'bg-blue-100 text-blue-800' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-sm text-gray-600">Due: {task.due}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">◊</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;
