import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleMatches = (userRole, requiredRole) => {
  if (!requiredRole) return true;

  const normalizedUserRole = userRole === 'customer' ? 'user' : userRole;
  const normalizedRequiredRole = requiredRole === 'customer' ? 'user' : requiredRole;
  return normalizedUserRole === normalizedRequiredRole;
};

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!roleMatches(user?.role, requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
