/**
 * Land Stack — Context Authorization Middleware
 * 
 * Validates that the officer's active context matches the required context
 * for the endpoint. Contexts: RURAL, URBAN, SHARED_GIS, STATE, NATIONAL
 * 
 * Must be used AFTER requireAuth.
 */

import { Errors } from '../core/errors.js';
import { Contexts, UserTypes } from '../core/permissions.js';

/**
 * Require specific context(s)
 * @param {...string} allowedContexts - e.g. 'RURAL', 'URBAN'
 */
export function requireContext(...allowedContexts) {
  return (req, res, next) => {
    if (!req.user) {
      return next(Errors.unauthenticated());
    }

    // Citizens don't have contexts — they see all relevant data
    if (req.user.userType === UserTypes.CITIZEN) {
      return next();
    }

    const activeContext = req.user.activeContext;

    if (!activeContext) {
      return next(Errors.forbiddenContext('No active context set. Please select a context first.'));
    }

    if (!allowedContexts.includes(activeContext)) {
      return next(Errors.forbiddenContext(
        `This action requires context: ${allowedContexts.join(' or ')}. Your active context is: ${activeContext}.`
      ));
    }

    next();
  };
}
