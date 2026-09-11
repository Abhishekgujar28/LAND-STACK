import React, { useState, useEffect } from 'react';
import { ROLES } from '../config/roles';
import { DEFAULT_OFFICERS } from './authConstants';
import { AuthContext } from './authContextInstance';
import authService from '../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('landstack_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_OFFICERS[ROLES.TALATHI];
  });

  const [role, setRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem('landstack_role');
      if (savedRole) return savedRole;
    } catch {
      // fallback
    }
    return ROLES.TALATHI;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('landstack_user', JSON.stringify(user));
        localStorage.setItem('landstack_role', role);
      } else {
        localStorage.removeItem('landstack_user');
        localStorage.removeItem('landstack_role');
      }
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [user, role]);

  const switchOfficerRole = (newRole) => {
    setLoading(true);
    const officer = DEFAULT_OFFICERS[newRole] || DEFAULT_OFFICERS[ROLES.TALATHI];
    setUser(officer);
    setRole(newRole);
    setLoading(false);
    return officer;
  };

  const loginAsCitizen = async (citizenId = 'CIT-001') => {
    setLoading(true);
    try {
      const res = await authService.loginCitizen({ identifier: citizenId });
      const citizen = res?.user || {
        id: citizenId,
        name: 'Aarav Patil',
        localName: 'आरव पाटील',
        stateCode: 'MH',
        mobile: '+91 98230 45891',
        email: 'aarav.patil@example.com',
      };
      setUser(citizen);
      setRole(ROLES.CITIZEN);
      setLoading(false);
      return citizen;
    } catch (err) {
      console.warn('Citizen login fallback:', err.message);
      const fallbackCitizen = {
        id: citizenId,
        name: 'Aarav Patil',
        localName: 'आरव पाटील',
        stateCode: 'MH',
        mobile: '+91 98230 45891',
        email: 'aarav.patil@example.com',
      };
      setUser(fallbackCitizen);
      setRole(ROLES.CITIZEN);
      setLoading(false);
      return fallbackCitizen;
    }
  };

  const loginAsOfficer = (officerRole = ROLES.TALATHI) => {
    return switchOfficerRole(officerRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('landstack_user');
    localStorage.removeItem('landstack_role');
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
