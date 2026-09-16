import apiClient from '../api/client';
import { DEFAULT_CITIZENS, DEFAULT_OFFICERS } from '../context/authConstants';

/**
 * Service to handle authentication via backend REST API
 * Database-Only (Cookie-based HttpOnly Supabase Session)
 */
export const authService = {
  /**
   * Request citizen OTP for a mobile number
   */
  requestCitizenOtp: async (mobile) => {
    return apiClient.post('auth/citizen/request-otp', { mobile });
  },

  /**
   * Verify citizen OTP and establish session cookie
   */
  verifyCitizenOtp: async (mobile, otp) => {
    return apiClient.post('auth/citizen/verify-otp', { mobile, otp });
  },

  /**
   * Government officer login with email and password
   */
  loginOfficer: async ({ email, password }) => {
    return apiClient.post('auth/government/login', { email, password });
  },

  /**
   * Get current authenticated user profile from session cookie
   */
  me: async () => {
    return apiClient.get('auth/me');
  },

  /**
   * Logout current session and clear cookies
   */
  logout: async () => {
    return apiClient.post('auth/logout');
  },

  /**
   * Get officer assigned jurisdictional contexts
   */
  getContexts: async () => {
    return apiClient.get('auth/contexts');
  },

  /**
   * Switch active jurisdictional context
   */
  switchContext: async (context, assignmentId) => {
    return apiClient.post('auth/context/switch', { context, assignmentId });
  },

  // Legacy compat alias (strictly requires explicit credentials in production)
  loginCitizen: async ({ mobile, otp }) => {
    return apiClient.post('auth/citizen/verify-otp', { mobile, otp });
  },

  /**
   * Development-only test citizen login via Supabase Auth
   */
  devLoginCitizen: async (citizenId) => {
    if (!import.meta.env.DEV) {
      throw new Error('Development login is disabled in production.');
    }
    return apiClient.post('auth/dev/citizen-login', { citizenId });
  },

  /**
   * Get registered demo users directory by role (Development-only helper)
   * @param {string} role - 'CITIZEN' or officer role
   */
  getUsersByRole: async (role) => {
    if (!import.meta.env.DEV) {
      return [];
    }
    if (role === 'CITIZEN') {
      return DEFAULT_CITIZENS;
    }
    const officers = Object.values(DEFAULT_OFFICERS);
    if (!role) return officers;
    return officers.filter((o) => o.role === role);
  },
};

export default authService;
