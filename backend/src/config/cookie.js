/**
 * Land Stack — Cookie Configuration
 * 
 * HTTP-only cookie strategy for JWT storage.
 * Tokens are NEVER stored in localStorage/sessionStorage.
 */

import { config } from './env.js';

const isProduction = config.nodeEnv === 'production';

/**
 * Cookie options for the access token
 * Short-lived (15 minutes)
 */
export const ACCESS_TOKEN_COOKIE = {
  name: 'ls_access_token',
  options: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  },
};

/**
 * Cookie options for the refresh token
 * Longer-lived (7 days)
 */
export const REFRESH_TOKEN_COOKIE = {
  name: 'ls_refresh_token',
  options: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth', // Only sent to auth endpoints
  },
};

/**
 * Set auth cookies on response
 */
export function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie(
    ACCESS_TOKEN_COOKIE.name,
    accessToken,
    ACCESS_TOKEN_COOKIE.options
  );

  if (refreshToken) {
    res.cookie(
      REFRESH_TOKEN_COOKIE.name,
      refreshToken,
      REFRESH_TOKEN_COOKIE.options
    );
  }
}

/**
 * Clear auth cookies on response (logout)
 */
export function clearAuthCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE.name, { path: '/' });
  res.clearCookie(REFRESH_TOKEN_COOKIE.name, { path: '/api/v1/auth' });
}

/**
 * Extract tokens from request cookies
 */
export function getTokensFromCookies(req) {
  return {
    accessToken: req.cookies?.[ACCESS_TOKEN_COOKIE.name] || null,
    refreshToken: req.cookies?.[REFRESH_TOKEN_COOKIE.name] || null,
  };
}
