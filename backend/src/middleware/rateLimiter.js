/**
 * Land Stack — Rate Limiting Middleware
 * 
 * Configurable per-endpoint rate limiting to prevent abuse.
 * Uses express-rate-limit with in-memory store (swap to Redis for multi-instance).
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';
import { ErrorCodes } from '../core/errors.js';

/**
 * General API rate limiter
 */
export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: ErrorCodes.LOGIN_RATE_LIMITED,
        message: 'Too many requests. Please try again later.',
      },
    });
  },
});

/**
 * OTP request rate limiter (stricter)
 */
export const otpRateLimiter = rateLimit({
  windowMs: config.rateLimit.otpWindowMs,
  max: config.rateLimit.otpMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { keyGeneratorIpFallback: false },
  keyGenerator: (req) => {
    // Rate limit by mobile number + IP
    return `${req.body?.mobile || req.ip || 'ip'}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: ErrorCodes.OTP_RATE_LIMITED,
        message: 'Too many OTP requests. Please wait before trying again.',
      },
    });
  },
});

/**
 * Login rate limiter
 */
export const loginRateLimiter = rateLimit({
  windowMs: config.rateLimit.loginWindowMs,
  max: config.rateLimit.loginMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { keyGeneratorIpFallback: false },
  keyGenerator: (req) => {
    return `${req.body?.email || req.body?.mobile || req.ip || 'ip'}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: ErrorCodes.LOGIN_RATE_LIMITED,
        message: 'Too many login attempts. Please try again later.',
      },
    });
  },
});
