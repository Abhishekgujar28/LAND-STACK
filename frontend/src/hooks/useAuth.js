import { useContext } from 'react';
import { AuthContext } from '../context/authContextInstance';
import { DEFAULT_OFFICERS } from '../context/authConstants';
import { ROLES } from '../config/roles';

export { DEFAULT_OFFICERS } from '../context/authConstants';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      role: null,
      loading: false,
      isAuthenticated: false,
      switchOfficerRole: () => {},
      loginAsCitizen: () => {},
      loginAsOfficer: () => {},
      logout: () => {},
      availableRoles: Object.keys(DEFAULT_OFFICERS),
    };
  }
  return context;
};

export default useAuth;
