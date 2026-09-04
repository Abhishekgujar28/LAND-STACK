import { useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * Hook to manage authentication state and user profile
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('CITIZEN');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const defaultUser = await authService.getMockCitizen('CIT-001');
        setUser(defaultUser);
        setRole('CITIZEN');
      } catch (err) {
        console.error('Failed to load initial mock user', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const loginAsCitizen = async (id = 'CIT-001') => {
    setLoading(true);
    const u = await authService.getMockCitizen(id);
    setUser(u);
    setRole('CITIZEN');
    setLoading(false);
    return u;
  };

  const loginAsOfficer = async (officerRole = 'TEHSILDAR') => {
    setLoading(true);
    const u = await authService.getMockGovernmentUser(officerRole);
    setUser(u);
    setRole(u.role);
    setLoading(false);
    return u;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return {
    user,
    role,
    loading,
    isAuthenticated: !!user,
    loginAsCitizen,
    loginAsOfficer,
    logout,
  };
};

export default useAuth;
