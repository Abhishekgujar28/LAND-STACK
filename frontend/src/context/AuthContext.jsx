import React, { useState, useEffect } from 'react';
import { ROLES } from '../config/roles';
import { DEFAULT_CITIZENS, DEFAULT_OFFICERS } from './authConstants';
import { AuthContext } from './authContextInstance';
import authService from '../services/authService';
import apiClient from '../api/client';

export const AuthStatus = {
  INITIALIZING: 'INITIALIZING',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  AUTHENTICATED: 'AUTHENTICATED',
  REFRESHING: 'REFRESHING',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
};

// Singleton promise to guarantee /auth/me is called exactly once across React StrictMode / remounts
let globalSessionPromise = null;

export const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(AuthStatus.INITIALIZING);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);

  // Hydrate session on mount from backend HttpOnly session cookie or Bearer token
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      if (!globalSessionPromise) {
        globalSessionPromise = authService.me().catch((err) => {
          console.warn('[AuthContext] Session check notice:', err.message);
          return null;
        });
      }

      try {
        const currentUser = await globalSessionPromise;
        if (!isMounted) return;

        if (currentUser && currentUser.role) {
          setUser(currentUser);
          setRole(currentUser.role);
          setAuthStatus(AuthStatus.AUTHENTICATED);
        } else {
          setUser(null);
          setRole(null);
          setAuthStatus(AuthStatus.UNAUTHENTICATED);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setRole(null);
          setError(err.message);
          setAuthStatus(AuthStatus.UNAUTHENTICATED);
        }
      } finally {
        globalSessionPromise = null;
      }
    };

    checkSession();

    // Register session expired listener from centralized apiClient
    apiClient.onSessionExpired(() => {
      if (isMounted) {
        setUser(null);
        setRole(null);
        setAuthStatus(AuthStatus.SESSION_EXPIRED);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const loginAsOfficer = async (email, password) => {
    setError(null);
    try {
      const res = await authService.loginOfficer({ email, password });
      const officer = res.user || res;
      if (res?.accessToken) {
        apiClient.setSession({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        });
      }
      setUser(officer);
      setRole(officer.role);
      setAuthStatus(AuthStatus.AUTHENTICATED);
      return officer;
    } catch (err) {
      console.warn('[Auth] Officer login failed:', err.message);
      setError(err.message);
      throw err;
    }
  };

  const loginAsCitizen = async (mobile, otp) => {
    setError(null);
    try {
      const res = await authService.verifyCitizenOtp(mobile, otp);
      const citizen = res.user || res;
      if (res?.accessToken) {
        apiClient.setSession({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        });
      }
      setUser(citizen);
      setRole(ROLES.CITIZEN);
      setAuthStatus(AuthStatus.AUTHENTICATED);
      return citizen;
    } catch (err) {
      console.warn('[Auth] Citizen OTP login error:', err.message);
      setError(err.message);
      throw err;
    }
  };

  const devLoginCitizen = async (citizenId) => {
    setError(null);
    try {
      const res = await authService.devLoginCitizen(citizenId);
      const citizen = res.user || res;
      if (res?.accessToken) {
        apiClient.setSession({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        });
      }
      setUser(citizen);
      setRole(ROLES.CITIZEN);
      setAuthStatus(AuthStatus.AUTHENTICATED);
      return citizen;
    } catch (err) {
      console.warn('[Auth] Dev citizen login error:', err.message);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    setAuthStatus(AuthStatus.UNAUTHENTICATED);
    setUser(null);
    setRole(null);
    setError(null);
    apiClient.clearSession();
    try {
      await authService.logout();
    } catch (err) {
      console.warn('[Auth] Logout notice:', err.message);
    }
  };

  const loading = authStatus === AuthStatus.INITIALIZING || authStatus === AuthStatus.REFRESHING;
  const isAuthenticated = authStatus === AuthStatus.AUTHENTICATED && !!user;

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        user,
        role,
        loading,
        error,
        isAuthenticated,
        loginAsOfficer,
        loginAsCitizen,
        devLoginCitizen,
        logout,
        switchOfficerRole: loginAsOfficer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
