import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';
import { ShieldAlert } from 'lucide-react';

import { AuthStatus } from '../../context/AuthContext';

/**
 * Production Route Guard
 * Enforces authentication and role-based access control (RBAC)
 * Prevents unauthorized API requests caused by unauthenticated navigation
 */
export const ProtectedRoute = ({ allowedRoles, portal = 'government', children }) => {
  const { user, role, loading, isAuthenticated, authStatus } = useAuth();
  const location = useLocation();

  if (loading || authStatus === AuthStatus.INITIALIZING || authStatus === AuthStatus.REFRESHING) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '1rem',
          color: '#475569',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #cbd5e1',
            borderTopColor: 'var(--ux4g-primary, #064e3b)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Verifying secure session credentials...</div>
      </div>
    );
  }

  if (!isAuthenticated || authStatus === AuthStatus.SESSION_EXPIRED || authStatus === AuthStatus.UNAUTHENTICATED) {
    const loginTarget = portal === 'citizen' ? '/login/citizen' : '/login/government';
    return <Navigate to={loginTarget} state={{ from: location, expired: authStatus === AuthStatus.SESSION_EXPIRED }} replace />;
  }

  // Check role authorization if specified
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(role);
    if (!hasRole) {
      return (
        <div
          className="ux4g-container"
          style={{
            maxWidth: '640px',
            margin: '4rem auto',
            padding: '2rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#dc2626',
            }}
          >
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#991b1b', marginBottom: '0.5rem' }}>
            403 — Access Restricted
          </h2>
          <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Your current authenticated profile (<strong>{user?.name || user?.email}</strong> — <code>{role}</code>)
            is not authorized to access this administrative workspace.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <a
              href={role === ROLES.CITIZEN ? '/citizen/dashboard' : '/government/dashboard'}
              style={{
                padding: '0.5rem 1.25rem',
                backgroundColor: 'var(--ux4g-primary, #064e3b)',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              Return to Authorized Workspace
            </a>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
