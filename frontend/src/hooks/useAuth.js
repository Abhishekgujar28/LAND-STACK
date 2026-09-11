import { useContext } from 'react';
import { AuthContext } from '../context/authContextInstance';
import { DEFAULT_OFFICERS } from '../context/authConstants';
import { ROLES } from '../config/roles';

export { DEFAULT_OFFICERS } from '../context/authConstants';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: DEFAULT_OFFICERS[ROLES.TALATHI],
      role: ROLES.TALATHI,
      loading: false,
      isAuthenticated: true,
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
