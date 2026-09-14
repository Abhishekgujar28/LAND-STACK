/**
 * Land Stack — Auth Controller
 * 
 * HTTP transport layer for authentication.
 * All business logic is in auth.service.js.
 */

import { authService } from './auth.service.js';
import { setAuthCookies, clearAuthCookies, getTokensFromCookies } from '../../config/cookie.js';
import { sendSuccess, sendCreated } from '../../core/response.js';

export const authController = {
  // POST /auth/citizen/request-otp
  requestOtp: async (req, res, next) => {
    try {
      const { mobile } = req.body; // Already validated by Zod middleware
      const result = await authService.requestCitizenOtp(mobile);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/citizen/verify-otp
  verifyOtp: async (req, res, next) => {
    try {
      const { mobile, otp } = req.body;
      const result = await authService.verifyCitizenOtp(mobile, otp);

      // Set tokens as HTTP-only cookies
      setAuthCookies(res, result.accessToken, result.refreshToken);

      // Return safe user data (never return tokens in body)
      sendSuccess(res, result.user);
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/government/login
  governmentLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.loginGovernment(email, password);

      // Set tokens as HTTP-only cookies
      setAuthCookies(res, result.accessToken, result.refreshToken);

      // Return safe user data
      sendSuccess(res, result.user);
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/refresh
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = getTokensFromCookies(req);

      if (!refreshToken) {
        return next(new (await import('../../core/errors.js')).Errors.sessionExpired());
      }

      const result = await authService.refreshSession(refreshToken);

      // Set new cookies
      setAuthCookies(res, result.accessToken, result.refreshToken);

      sendSuccess(res, { refreshed: true });
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/logout
  logout: async (req, res, next) => {
    try {
      const { accessToken } = getTokensFromCookies(req);
      await authService.logout(accessToken);

      // Clear cookies
      clearAuthCookies(res);

      sendSuccess(res, { loggedOut: true });
    } catch (err) {
      // Always clear cookies even if logout fails
      clearAuthCookies(res);
      sendSuccess(res, { loggedOut: true });
    }
  },

  // GET /auth/me
  getMe: async (req, res, next) => {
    try {
      const me = await authService.getMe(req.user);
      sendSuccess(res, me);
    } catch (err) {
      next(err);
    }
  },

  // GET /auth/contexts
  getContexts: async (req, res, next) => {
    try {
      const contexts = await authService.getContexts(req.user);
      sendSuccess(res, contexts);
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/context/switch
  switchContext: async (req, res, next) => {
    try {
      const { context, assignmentId } = req.body;
      const result = await authService.switchContext(req.user, context, assignmentId);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },
};
