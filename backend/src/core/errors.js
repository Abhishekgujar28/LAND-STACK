/**
 * Land Stack — Structured Error System
 * 
 * Every API error carries a stable `code` that the frontend can handle programmatically,
 * plus a human-readable `message` for display. Internal details are never leaked.
 */

// ─── Stable Error Codes ────────────────────────────────────────────────────────
export const ErrorCodes = Object.freeze({
  // Auth
  UNAUTHENTICATED:       'UNAUTHENTICATED',
  INVALID_TOKEN:         'INVALID_TOKEN',
  SESSION_EXPIRED:       'SESSION_EXPIRED',
  MFA_REQUIRED:          'MFA_REQUIRED',
  INVALID_OTP:           'INVALID_OTP',
  OTP_EXPIRED:           'OTP_EXPIRED',
  OTP_RATE_LIMITED:      'OTP_RATE_LIMITED',
  LOGIN_RATE_LIMITED:    'LOGIN_RATE_LIMITED',
  ACCOUNT_INACTIVE:      'ACCOUNT_INACTIVE',

  // Authorization
  FORBIDDEN:             'FORBIDDEN',
  FORBIDDEN_ROLE:        'FORBIDDEN_ROLE',
  FORBIDDEN_PERMISSION:  'FORBIDDEN_PERMISSION',
  FORBIDDEN_CONTEXT:     'FORBIDDEN_CONTEXT',
  FORBIDDEN_JURISDICTION:'FORBIDDEN_JURISDICTION',
  FORBIDDEN_RESOURCE:    'FORBIDDEN_RESOURCE',

  // Resources
  RESOURCE_NOT_FOUND:    'RESOURCE_NOT_FOUND',
  CONFLICT:              'CONFLICT',

  // Workflow
  INVALID_STATE_TRANSITION: 'INVALID_STATE_TRANSITION',
  DOCUMENT_REQUIRED:     'DOCUMENT_REQUIRED',
  CASE_LOCKED:           'CASE_LOCKED',

  // Validation
  VALIDATION_ERROR:      'VALIDATION_ERROR',
  INVALID_INPUT:         'INVALID_INPUT',

  // External
  SOURCE_UNAVAILABLE:    'SOURCE_UNAVAILABLE',
  SOURCE_TIMEOUT:        'SOURCE_TIMEOUT',

  // System
  INTERNAL_ERROR:        'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE:   'SERVICE_UNAVAILABLE',
});

// ─── HTTP Status Mapping ───────────────────────────────────────────────────────
const CODE_TO_STATUS = {
  [ErrorCodes.UNAUTHENTICATED]:        401,
  [ErrorCodes.INVALID_TOKEN]:          401,
  [ErrorCodes.SESSION_EXPIRED]:        401,
  [ErrorCodes.INVALID_OTP]:            401,
  [ErrorCodes.OTP_EXPIRED]:            401,
  [ErrorCodes.MFA_REQUIRED]:           403,
  [ErrorCodes.ACCOUNT_INACTIVE]:       403,
  [ErrorCodes.FORBIDDEN]:              403,
  [ErrorCodes.FORBIDDEN_ROLE]:         403,
  [ErrorCodes.FORBIDDEN_PERMISSION]:   403,
  [ErrorCodes.FORBIDDEN_CONTEXT]:      403,
  [ErrorCodes.FORBIDDEN_JURISDICTION]: 403,
  [ErrorCodes.FORBIDDEN_RESOURCE]:     403,
  [ErrorCodes.RESOURCE_NOT_FOUND]:     404,
  [ErrorCodes.CONFLICT]:               409,
  [ErrorCodes.INVALID_STATE_TRANSITION]: 409,
  [ErrorCodes.CASE_LOCKED]:            409,
  [ErrorCodes.DOCUMENT_REQUIRED]:      422,
  [ErrorCodes.VALIDATION_ERROR]:       422,
  [ErrorCodes.INVALID_INPUT]:          400,
  [ErrorCodes.OTP_RATE_LIMITED]:       429,
  [ErrorCodes.LOGIN_RATE_LIMITED]:     429,
  [ErrorCodes.SOURCE_UNAVAILABLE]:     502,
  [ErrorCodes.SOURCE_TIMEOUT]:         504,
  [ErrorCodes.INTERNAL_ERROR]:         500,
  [ErrorCodes.SERVICE_UNAVAILABLE]:    503,
};

// ─── AppError Base Class ───────────────────────────────────────────────────────
export class AppError extends Error {
  /**
   * @param {string} code    - One of ErrorCodes
   * @param {string} message - Human-readable message (safe for frontend display)
   * @param {object} [details] - Optional structured details (validation errors, etc.)
   */
  constructor(code, message, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = CODE_TO_STATUS[code] || 500;
    this.details = details;
    this.isOperational = true; // distinguishes from programmer errors
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Convenience Factories ─────────────────────────────────────────────────────
export const Errors = {
  unauthenticated: (msg = 'Authentication required.') =>
    new AppError(ErrorCodes.UNAUTHENTICATED, msg),

  invalidToken: (msg = 'Invalid or malformed token.') =>
    new AppError(ErrorCodes.INVALID_TOKEN, msg),

  sessionExpired: (msg = 'Session has expired. Please log in again.') =>
    new AppError(ErrorCodes.SESSION_EXPIRED, msg),

  mfaRequired: (msg = 'MFA verification required for this action.') =>
    new AppError(ErrorCodes.MFA_REQUIRED, msg),

  invalidOtp: (msg = 'Invalid OTP. Please try again.') =>
    new AppError(ErrorCodes.INVALID_OTP, msg),

  otpExpired: (msg = 'OTP has expired. Please request a new one.') =>
    new AppError(ErrorCodes.OTP_EXPIRED, msg),

  otpRateLimited: (msg = 'Too many OTP requests. Please wait before trying again.') =>
    new AppError(ErrorCodes.OTP_RATE_LIMITED, msg),

  accountInactive: (msg = 'This account is inactive. Contact your administrator.') =>
    new AppError(ErrorCodes.ACCOUNT_INACTIVE, msg),

  forbidden: (msg = 'You do not have permission to perform this action.') =>
    new AppError(ErrorCodes.FORBIDDEN, msg),

  forbiddenRole: (msg = 'Your role does not allow this action.') =>
    new AppError(ErrorCodes.FORBIDDEN_ROLE, msg),

  forbiddenPermission: (permission, msg) =>
    new AppError(ErrorCodes.FORBIDDEN_PERMISSION, msg || `Missing required permission: ${permission}.`),

  forbiddenContext: (msg = 'This action is not available in your current context.') =>
    new AppError(ErrorCodes.FORBIDDEN_CONTEXT, msg),

  forbiddenJurisdiction: (msg = 'You are not authorized to access resources in this jurisdiction.') =>
    new AppError(ErrorCodes.FORBIDDEN_JURISDICTION, msg),

  forbiddenResource: (msg = 'You are not authorized to access this resource.') =>
    new AppError(ErrorCodes.FORBIDDEN_RESOURCE, msg),

  notFound: (resource = 'Resource', id = '') =>
    new AppError(ErrorCodes.RESOURCE_NOT_FOUND, id ? `${resource} '${id}' not found.` : `${resource} not found.`),

  conflict: (msg = 'A conflicting operation is in progress.') =>
    new AppError(ErrorCodes.CONFLICT, msg),

  invalidStateTransition: (from, to) =>
    new AppError(ErrorCodes.INVALID_STATE_TRANSITION, `Invalid state transition from '${from}' to '${to}'.`),

  caseLocked: (msg = 'This case is locked by another officer.') =>
    new AppError(ErrorCodes.CASE_LOCKED, msg),

  documentRequired: (docType) =>
    new AppError(ErrorCodes.DOCUMENT_REQUIRED, `Required document missing: ${docType}.`),

  validation: (details) =>
    new AppError(ErrorCodes.VALIDATION_ERROR, 'Validation failed.', details),

  invalidInput: (msg = 'Invalid input provided.') =>
    new AppError(ErrorCodes.INVALID_INPUT, msg),

  sourceUnavailable: (source) =>
    new AppError(ErrorCodes.SOURCE_UNAVAILABLE, `External data source unavailable: ${source}.`),

  internal: (msg = 'An internal error occurred.') =>
    new AppError(ErrorCodes.INTERNAL_ERROR, msg),
};
