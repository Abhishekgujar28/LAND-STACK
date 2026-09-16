import React, { useState, useEffect } from 'react';
import { ROLES } from '../config/roles';
import { DEFAULT_CITIZENS, DEFAULT_OFFICERS } from './authConstants';
import { AuthContext } from './authContextInstance';
import authService from '../services/authService';
import apiClient from '../api/client';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate session on mount from backend HttpOnly session cookie or Bearer token
  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      try {
        const currentUser = await authService.me();
        if (isMounted && currentUser && currentUser.role) {
          setUser(currentUser);
          setRole(currentUser.role);
          setLoading(false);
          return;
        }
      } catch {
        // No active session
      }

      if (isMounted) {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    };

    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const switchOfficerRole = async (email, password = 'Password123!') => {
    setLoading(true);
    try {
      const loggedIn = await authService.loginOfficer({ email, password });
      if (loggedIn?.accessToken) {
        apiClient.setToken(loggedIn.accessToken);
      }
      setUser(loggedIn);
      setRole(loggedIn.role);
      return loggedIn;
    } catch (err) {
      console.warn('[Auth] Officer login failed:', err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsCitizen = async (mobile, otp = '123456') => {
    setLoading(true);
    try {
      const citizen = await authService.verifyCitizenOtp(mobile, otp);
      if (citizen?.accessToken) {
        apiClient.setToken(citizen.accessToken);
      }
      setUser(citizen);
      setRole(ROLES.CITIZEN);
      return citizen;
    } catch (err) {
      console.warn('[Auth] Citizen OTP login error:', err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsOfficer = (email, password) => {
    return switchOfficerRole(email, password);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.warn('[Auth] Logout error:', err.message);
    } finally {
      apiClient.setToken(null);
      setUser(null);
      setRole(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated: !!user,
        switchOfficerRole,
        loginAsCitizen,
        loginAsOfficer,
        logout,
        availableRoles: Object.keys(DEFAULT_OFFICERS),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
