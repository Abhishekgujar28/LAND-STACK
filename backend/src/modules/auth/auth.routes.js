/**
 * Land Stack — Auth Routes
 * 
 * Authentication endpoints for citizens and government officers.
 * Public endpoints (login/OTP) have rate limiting but no auth.
 * Protected endpoints (me/contexts) require authentication.
 */

import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../middleware/validateRequest.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireGovernment } from '../../middleware/requireRole.js';
import { otpRateLimiter, loginRateLimiter } from '../../middleware/rateLimiter.js';
import {
  requestOtpSchema,
  verifyOtpSchema,
  governmentLoginSchema,
  contextSwitchSchema,
} from './auth.validators.js';

const router = Router();

// ─── Citizen Auth ──────────────────────────────────────────────────────────────
router.post(
  '/citizen/request-otp',
  otpRateLimiter,
  validate({ body: requestOtpSchema }),
  authController.requestOtp
);

router.post(
  '/citizen/verify-otp',
  loginRateLimiter,
  validate({ body: verifyOtpSchema }),
  authController.verifyOtp
);

// ─── Development-Only Citizen Test Login ─────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  router.post(
    '/dev/citizen-login',
    loginRateLimiter,
    authController.devLoginCitizen
  );
}

// ─── Government Auth ───────────────────────────────────────────────────────────
router.post(
  '/government/login',
  loginRateLimiter,
  validate({ body: governmentLoginSchema }),
  authController.governmentLogin
);

// ─── Session Management ────────────────────────────────────────────────────────
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// ─── Protected: User Info ──────────────────────────────────────────────────────
router.get('/me', requireAuth, authController.getMe);

// ─── Protected: Officer Contexts ───────────────────────────────────────────────
router.get(
  '/contexts',
  requireAuth,
  requireGovernment(),
  authController.getContexts
);

router.post(
  '/context/switch',
  requireAuth,
  requireGovernment(),
  validate({ body: contextSwitchSchema }),
  authController.switchContext
);

export default router;
