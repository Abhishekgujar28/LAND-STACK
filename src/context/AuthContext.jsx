import React, { useState, useEffect } from 'react';
import citizensData from '../data/users/citizens.json';
import { ROLES } from '../config/roles';
import { DEFAULT_OFFICERS } from './authConstants';
import { AuthContext } from './authContextInstance';

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

  const loginAsCitizen = (citizenId = 'CIT-001') => {
    setLoading(true);
    const citizen = citizensData.find((c) => c.id === citizenId) || citizensData[0];
    setUser(citizen);
    setRole(ROLES.CITIZEN);
    setLoading(false);
    return citizen;
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
