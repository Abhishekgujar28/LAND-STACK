import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';

const isGovernmentRole = (role) => role && role !== ROLES.CITIZEN;

export const ProtectedRoute = ({ audience, children }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    const loginPath = audience === 'citizen' ? '/login/citizen' : '/login/government';
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  const hasAccess = audience === 'citizen'
    ? role === ROLES.CITIZEN
    : isGovernmentRole(role);

  if (!hasAccess) {
    return <Navigate to={role === ROLES.CITIZEN ? '/citizen/dashboard' : '/government/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
