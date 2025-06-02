import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      // Handle invalid allowedRoles
      if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        console.error('ProtectedRoute: allowedRoles is invalid or empty');
        setIsAuthenticated(false);
        return;
      }

      // Determine token and endpoint based on role and route
      let token = null;
      let authEndpoint = null;

      if (allowedRoles.includes('child') && location.pathname.startsWith('/game')) {
        token = localStorage.getItem('child_token');
        authEndpoint = 'http://localhost:3000/child/verify-token';
      } else if (allowedRoles.includes('admin') && location.pathname.includes('/admin')) {
        token = localStorage.getItem('admin_token');
        authEndpoint = 'http://localhost:3000/admin/verify-token';
      } else if (allowedRoles.includes('superadmin') && location.pathname.startsWith('/superadmin')) {
        token = localStorage.getItem('superadmin_token');
        authEndpoint = 'http://localhost:3000/superadmin/verify-token';
      }

      if (!token) {
        console.log('No token found for role:', allowedRoles);
        setIsAuthenticated(false);
        return;
      }

      try {
        // Verify token with backend
        await axios.get(authEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token verification failed:', error.response?.data || error.message);
        localStorage.removeItem('child_token');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('superadmin_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('admin_id');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [allowedRoles, location.pathname]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect based on the first allowed role
    const role = allowedRoles[0];
    const redirectTo =
      role === 'child' ? '/' :
      role === 'admin' ? '/admin-login' :
      role === 'superadmin' ? '/superadmin-login' :
      '/'; // Fallback
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;