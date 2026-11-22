import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

/**
 * Route guard component: enforces authentication and Role-Based Access Control (RBAC)
 * @param {Array} allowedRoles - list of roles authorized to view route (e.g. ['recruiter', 'admin'])
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size="lg" text="Authenticating..." />
      </div>
    );
  }

  // Not logged in -> redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role restriction check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to home or candidate/recruiter dashboard according to actual role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
