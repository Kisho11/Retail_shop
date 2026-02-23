import React from 'react';
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartToast from './components/CartToast';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductsByIndustry from './pages/ProductsByIndustry';
import Showroom from './pages/Showroom';
import Clients from './pages/Clients';
import Reviews from './pages/Reviews';
import Catalogue from './pages/Catalogue';
import Sponsor from './pages/Sponsor';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import CustomerPortal from './pages/CustomerPortal';

function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartToast />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ProductProvider>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Login />} />

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/manager/dashboard"
                  element={
                    <ProtectedRoute requiredRole="manager">
                      <ManagerDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/products-by-industry" element={<ProductsByIndustry />} />
                  <Route path="/products-by-industry/:industry" element={<ProductsByIndustry />} />
                  <Route path="/showroom" element={<Showroom />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/catalogue" element={<Catalogue />} />
                  <Route path="/sponsor" element={<Sponsor />} />
                  <Route path="/customer-portal" element={<CustomerPortal />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </ProductProvider>
  );
}

export default App;
