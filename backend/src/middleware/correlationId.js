/**
 * Land Stack — Correlation ID Middleware
 * 
 * Assigns a unique correlation ID to every request for tracing.
 * Included in error responses and audit events.
 */

import { v4 as uuidv4 } from 'uuid';

export function correlationId(req, res, next) {
  const id = req.headers['x-correlation-id'] || uuidv4();
  req.correlationId = id;
  res.setHeader('X-Correlation-Id', id);
  next();
}
