import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import products from '../data/products';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import ManagerManagement from './ManagerManagement';
import OrderDetailsModal from '../components/OrderDetailsModal';
import UiIcon from '../components/UiIcon';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
  );
  const recentOrders = sortedOrders.slice(0, 5);
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
  const pendingOrders = orders.filter((order) => order.status === 'Pending').length;

  // Mock data for statistics
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    totalCustomers: 856,
    pendingOrders,
    lowStockProducts: 8,
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-primary to-black text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-accent">
            <UiIcon name="userShield" className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-blue-100">Logged in as</p>
              <p className="font-bold">{user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto border-b border-gray-300 pb-4">
          {['overview', 'products', 'categories', 'managers', 'orders', 'customers', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm">Total Products</p>
                    <p className="text-4xl font-bold text-primary mt-2">{stats.totalProducts}</p>
                  </div>
                  <UiIcon name="box" className="h-10 w-10 text-primary" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-4xl font-bold text-green-700 mt-2">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <UiIcon name="currency" className="h-10 w-10 text-green-700" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm">Total Orders</p>
                    <p className="text-4xl font-bold text-purple-700 mt-2">{stats.totalOrders}</p>
                  </div>
                  <UiIcon name="list" className="h-10 w-10 text-purple-700" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm">Total Customers</p>
                    <p className="text-4xl font-bold text-orange-700 mt-2">{stats.totalCustomers}</p>
                  </div>
                  <UiIcon name="users" className="h-10 w-10 text-orange-700" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm">Pending Orders</p>
                    <p className="text-4xl font-bold text-blue-700 mt-2">{stats.pendingOrders}</p>
                  </div>
                  <UiIcon name="clock" className="h-10 w-10 text-blue-700" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm">Low Stock Items</p>
                    <p className="text-4xl font-bold text-yellow-700 mt-2">{stats.lowStockProducts}</p>
                  </div>
                  <UiIcon name="alert" className="h-10 w-10 text-yellow-700" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-primary">
                <UiIcon name="list" className="h-6 w-6" />
                Recent Orders
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Order ID</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-primary">#{order.id}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <ProductManagement />
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <CategoryManagement />
        )}

        {/* Managers Tab */}
        {activeTab === 'managers' && (
          <ManagerManagement />
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-primary">
              <UiIcon name="list" className="h-6 w-6" />
              All Orders
            </h3>
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
                  {sortedOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-primary">#{order.id}</td>
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
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-primary">
              <UiIcon name="users" className="h-6 w-6" />
              Customers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-full"></div>
                    <div>
                      <p className="font-bold text-gray-800">Customer {i}</p>
                      <p className="text-sm text-gray-600">customer{i}@email.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Orders:</strong> {Math.floor(Math.random() * 10) + 1}</p>
                    <p><strong>Total Spent:</strong> ${(Math.random() * 5000 + 500).toFixed(2)}</p>
                    <p><strong>Join Date:</strong> 2025-2026</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-primary">
              <UiIcon name="chart" className="h-6 w-6" />
              Reports & Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-lg text-gray-800 mb-4">Sales This Month</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sales</span>
                    <span className="font-bold text-primary">$45,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Orders</span>
                    <span className="font-bold text-primary">342</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Order Value</span>
                    <span className="font-bold text-accent">$132.14</span>
                  </div>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-lg text-gray-800 mb-4">Top Categories</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shop Shelving</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Displays</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Refrigeration</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} accentClass="text-primary" />
      </div>
    </div>
  );
}

export default AdminDashboard;
