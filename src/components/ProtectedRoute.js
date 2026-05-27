import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleMatches = (userRole, requiredRole) => {
  if (!requiredRole) return true;

  const normalizedUserRole = userRole === 'customer' ? 'user' : userRole;
  const normalizedRequiredRole = requiredRole === 'customer' ? 'user' : requiredRole;
  return normalizedUserRole === normalizedRequiredRole;
};

const getLoginRedirect = (requiredRole) => {
  if (requiredRole === 'admin' || requiredRole === 'manager') {
    return '/login?mode=staff-signin';
  }

  return '/login?mode=customer-signin';
};

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={getLoginRedirect(requiredRole)} replace />;
  }

  if (!roleMatches(user?.role, requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
