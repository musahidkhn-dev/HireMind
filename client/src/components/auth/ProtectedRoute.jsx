import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../common/Loader';

// FIXED: Updated ProtectedRoute to wait for initialized state with a custom spinner
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  const token = localStorage.getItem('accessToken');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-amber-600 rounded-full animate-spin" />
      </div>
    );
  }

  // FIXED: Check token directly to prevent bounce on refresh. If user is still null after loading completes, session is invalid.
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-amber-600 rounded-full animate-spin" />
      </div>
    );
  }

  // FIXED: Explicit role redirect to prevent bounce loops with generic /dashboard
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const correctPath =
      (user.role === 'superadmin' || user.role === 'super_admin')
        ? '/dashboard/admin'
        : user.role === 'candidate'
        ? '/dashboard/candidate'
        : '/dashboard/company';

    return <Navigate to={correctPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
