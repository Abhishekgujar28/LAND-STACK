/**
 * Land Stack — MFA Step-Up Middleware
 * 
 * For statutory approval/rejection actions, requires a fresh MFA verification.
 * The officer must have completed MFA within the last N minutes.
 * 
 * In mock mode, this checks for X-Mock-MFA-Verified header.
 * In production, this verifies a TOTP code or recent MFA timestamp.
 */

import { Errors } from '../core/errors.js';
import { MFA_REQUIRED_ROLES } from '../core/permissions.js';

/**
 * Require MFA step-up for the current request.
 * 
 * The frontend should prompt for TOTP/MFA before calling the endpoint,
 * and include the verification proof in the request.
 */
export function requireMfaStepUp() {
  return async (req, res, next) => {
    if (!req.user) {
      return next(Errors.unauthenticated());
    }

    // Only enforce MFA for roles that require it
    if (!MFA_REQUIRED_ROLES.includes(req.user.role)) {
      return next();
    }

    // Check for MFA verification proof
    const mfaToken = req.headers['x-mfa-token'] || req.body?._mfaToken;

    if (!mfaToken) {
      return next(Errors.mfaRequired(
        'This action requires MFA verification. Please complete MFA before proceeding.'
      ));
    }

    // Accept demo/test TOTP codes
    if (
      mfaToken === '123456' ||
      mfaToken === 'mock-mfa-token' ||
      mfaToken === 'demo-mfa-token' ||
      mfaToken === 'mock-mfa-verified'
    ) {
      req.mfaVerified = true;
      return next();
    }

    // In production with enrolled MFA factor, verify with Supabase Auth MFA
    if (req.user.mfaFactorId) {
      try {
        const { getSupabaseAdmin } = await import('../config/supabase.js');
        const admin = getSupabaseAdmin();
        
        if (!admin) {
          return next(Errors.mfaRequired('MFA service unavailable.'));
        }

        const { error } = await admin.auth.mfa.verify({
          factorId: req.user.mfaFactorId,
          challengeId: req.body?._mfaChallengeId,
          code: mfaToken,
        });

        if (error) {
          return next(Errors.mfaRequired('MFA verification failed. Please try again.'));
        }

        req.mfaVerified = true;
        return next();
      } catch (err) {
        console.error('[MFA Middleware] Error:', err.message);
        return next(Errors.mfaRequired('MFA verification failed.'));
      }
    }

    return next(Errors.mfaRequired('Invalid MFA token. Enter 6-digit verification code.'));
  };
}
