/**
 * Land Stack — Centralized Error Handling Middleware
 * 
 * Handles both operational AppErrors and unexpected programmer errors.
 * Never leaks database internals, stack traces, or sensitive data.
 */

import { AppError, ErrorCodes } from '../core/errors.js';
import { sendError } from '../core/response.js';

export const errorHandler = (err, req, res, next) => {
  // Already sent a response
  if (res.headersSent) {
    return next(err);
  }

  // Operational errors (AppError) — safe to return to the client
  if (err instanceof AppError) {
    // Log at appropriate level
    if (err.statusCode >= 500) {
      console.error(`[Error] ${err.code} | ${req.method} ${req.originalUrl} | ${err.message}`, {
        correlationId: req.correlationId,
        stack: err.stack,
      });
    } else if (err.statusCode >= 400) {
      console.warn(`[Warn] ${err.code} | ${req.method} ${req.originalUrl} | ${err.message}`, {
        correlationId: req.correlationId,
      });
    }

    return sendError(res, {
      code: err.code,
      message: err.message,
      details: err.details,
      statusCode: err.statusCode,
      requestId: req.correlationId,
    });
  }

  // Zod validation errors (if not caught by validate middleware)
  if (err.name === 'ZodError') {
    const details = err.errors?.map(e => ({
      field: e.path?.join('.'),
      message: e.message,
    }));

    return sendError(res, {
      code: ErrorCodes.VALIDATION_ERROR,
      message: 'Validation failed.',
      details,
      statusCode: 422,
      requestId: req.correlationId,
    });
  }

  // Unexpected errors — log full details, return generic message
  console.error(`[CRITICAL] Unhandled error | ${req.method} ${req.originalUrl}`, {
    correlationId: req.correlationId,
    error: err.message,
    stack: err.stack,
    name: err.name,
  });

  return sendError(res, {
    code: ErrorCodes.INTERNAL_ERROR,
    message: process.env.NODE_ENV === 'development'
      ? `Internal error: ${err.message}`
      : 'An internal error occurred. Please try again later.',
    statusCode: 500,
    requestId: req.correlationId,
  });
};
