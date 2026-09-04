import citizensData from '../data/users/citizens.json';
import governmentUsersData from '../data/users/governmentUsers.json';

/**
 * Service to handle mock user authentication, role lookup, and mock profiles
 */
export const authService = {
  getMockCitizen: async (id = 'CIT-001') => {
    return citizensData.find((c) => c.id === id) || citizensData[0];
  },

  getMockGovernmentUser: async (role = 'TEHSILDAR') => {
    return governmentUsersData.find((g) => g.role === role) || governmentUsersData[0];
  },

  getMockUser: async () => {
    return citizensData[0];
  },

  getUsersByRole: async (role) => {
    if (role === 'CITIZEN') return citizensData;
    return governmentUsersData.filter((u) => u.role === role);
  },

  loginCitizen: async ({ identifier }) => {
    const user = citizensData.find(
      (c) => c.mobile.includes(identifier) || c.email === identifier || c.id === identifier
    ) || citizensData[0];
    return { success: true, user, role: 'CITIZEN' };
  },

  loginOfficer: async ({ identifier, role }) => {
    const user = governmentUsersData.find(
      (g) => g.id === identifier || g.email === identifier || (role && g.role === role)
    ) || governmentUsersData[0];
    return { success: true, user, role: user.role };
  },
};

export default authService;
