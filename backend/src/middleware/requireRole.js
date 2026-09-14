/**
 * Land Stack — Role Authorization Middleware
 * 
 * Checks that the authenticated user has one of the allowed roles.
 * Must be used AFTER requireAuth.
 */

import { Errors } from '../core/errors.js';
import { UserTypes } from '../core/permissions.js';

/**
 * Require specific user type(s)
 * @param {...string} allowedTypes - 'CITIZEN', 'GOVERNMENT', or both
 */
export function requireUserType(...allowedTypes) {
  return (req, res, next) => {
    if (!req.user) {
      return next(Errors.unauthenticated());
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return next(Errors.forbiddenRole(
        `This endpoint requires user type: ${allowedTypes.join(' or ')}.`
      ));
    }

    next();
  };
}

/**
 * Require specific role(s)
 * @param {...string} allowedRoles - e.g. 'TEHSILDAR', 'CRO', 'CITIZEN'
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(Errors.unauthenticated());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(Errors.forbiddenRole(
        `This action requires role: ${allowedRoles.join(' or ')}.`
      ));
    }

    next();
  };
}

/**
 * Require the user to be a citizen
 */
export function requireCitizen() {
  return requireUserType(UserTypes.CITIZEN);
}

/**
 * Require the user to be a government officer
 */
export function requireGovernment() {
  return requireUserType(UserTypes.GOVERNMENT);
}
