import React, { useState, useEffect } from 'react';
import { ROLES } from '../config/roles';
import { DEFAULT_CITIZENS, DEFAULT_OFFICERS } from './authConstants';
import { AuthContext } from './authContextInstance';
import authService from '../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate session on mount from backend HttpOnly session cookie
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
        // No active cookie session
      }

      // If no active session, log in default Talathi officer to provide seamless initial view
      if (isMounted) {
        try {
          const talathi = DEFAULT_OFFICERS[ROLES.TALATHI];
          const loggedIn = await authService.loginOfficer({
            email: talathi.email,
            password: 'Password123!',
          });
          if (isMounted && loggedIn) {
            setUser(loggedIn);
            setRole(loggedIn.role || ROLES.TALATHI);
          }
        } catch (err) {
          console.warn('[Auth] Default officer session init:', err.message);
          if (isMounted) {
            setUser(DEFAULT_OFFICERS[ROLES.TALATHI]);
            setRole(ROLES.TALATHI);
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };

    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const switchOfficerRole = async (newRole) => {
    setLoading(true);
    const officerPreset = DEFAULT_OFFICERS[newRole] || DEFAULT_OFFICERS[ROLES.TALATHI];
    try {
      const loggedIn = await authService.loginOfficer({
        email: officerPreset.email,
        password: 'Password123!',
      });
      setUser(loggedIn);
      setRole(loggedIn.role || newRole);
      return loggedIn;
    } catch (err) {
      console.warn('[Auth] Real officer login failed, using preset:', err.message);
      setUser(officerPreset);
      setRole(newRole);
      return officerPreset;
    } finally {
      setLoading(false);
    }
  };

  const loginAsCitizen = async (identifier = '+91 98230 45891') => {
    setLoading(true);
    try {
      const mobile = identifier.startsWith('+') ? identifier : (DEFAULT_CITIZENS.find((c) => c.id === identifier)?.mobile || '+91 98230 45891');
      const citizen = await authService.verifyCitizenOtp(mobile, '123456');
      setUser(citizen);
      setRole(ROLES.CITIZEN);
      return citizen;
    } catch (err) {
      console.warn('[Auth] Citizen OTP login error:', err.message);
      const defaultCitizen = DEFAULT_CITIZENS[0];
      setUser(defaultCitizen);
      setRole(ROLES.CITIZEN);
      return defaultCitizen;
    } finally {
      setLoading(false);
    }
  };

  const loginAsOfficer = (officerRole = ROLES.TALATHI) => {
    return switchOfficerRole(officerRole);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.warn('[Auth] Logout error:', err.message);
    } finally {
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
