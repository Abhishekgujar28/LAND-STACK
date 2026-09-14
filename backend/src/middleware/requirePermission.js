/**
 * Land Stack — Permission Authorization Middleware
 * 
 * Checks that the authenticated user's role grants a specific permission.
 * Uses the centralized ROLE_PERMISSIONS map — never scattered if/else checks.
 * Must be used AFTER requireAuth.
 */

import { Errors } from '../core/errors.js';
import { roleHasPermission } from '../core/permissions.js';

/**
 * Require specific permission(s)
 * @param {...string} requiredPermissions - permission strings from Permissions enum
 *   If multiple are given, ALL must be present.
 */
export function requirePermission(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return next(Errors.unauthenticated());
    }

    const { role } = req.user;

    for (const perm of requiredPermissions) {
      if (!roleHasPermission(role, perm)) {
        return next(Errors.forbiddenPermission(perm));
      }
    }

    next();
  };
}

/**
 * Require ANY of the given permissions (at least one must match)
 */
export function requireAnyPermission(...permissions) {
  return (req, res, next) => {
    if (!req.user) {
      return next(Errors.unauthenticated());
    }

    const { role } = req.user;
    const hasAny = permissions.some(perm => roleHasPermission(role, perm));

    if (!hasAny) {
      return next(Errors.forbiddenPermission(
        permissions.join(', '),
        `Missing required permission. Need one of: ${permissions.join(', ')}.`
      ));
    }

    next();
  };
}
