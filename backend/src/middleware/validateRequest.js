/**
 * Land Stack — Request Validation Middleware (Zod)
 * 
 * Validates request params, query, and body against Zod schemas.
 * Replaces trusting raw user input everywhere.
 */

import { ZodError } from 'zod';
import { Errors } from '../core/errors.js';

/**
 * Create validation middleware from Zod schemas.
 * 
 * @param {object} schemas - { body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }
 * @returns Express middleware
 * 
 * Usage:
 *   router.post('/endpoint', validate({ body: myZodSchema }), controller.handler)
 */
export function validate(schemas) {
  return (req, res, next) => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
        }));
        return next(Errors.validation(details));
      }
      next(err);
    }
  };
}

export const validateRequest = validate;
export default validate;
