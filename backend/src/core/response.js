/**
 * Land Stack — Standardized API Response Helpers
 * 
 * Every API response follows the same shape for consistency:
 * Success: { success: true, data: ..., message?: ..., page?: ... }
 * Error:   { success: false, error: { code, message, details? }, requestId: ... }
 */

/**
 * Standard success response
 * Accepts (res, data, statusCode) or (res, data, message, statusCode)
 */
export function sendSuccess(res, data, messageOrStatus = 200, maybeStatus = 200) {
  let status = 200;
  let message = null;

  if (typeof messageOrStatus === 'number') {
    status = messageOrStatus;
  } else if (typeof messageOrStatus === 'string') {
    message = messageOrStatus;
    if (typeof maybeStatus === 'number') {
      status = maybeStatus;
    }
  }

  const body = {
    success: true,
    data,
  };

  if (message) {
    body.message = message;
  }

  return res.status(status).json(body);
}

/**
 * Success response with pagination metadata
 * Supports either:
 * - sendPaginated(res, data, { nextCursor, hasMore, total })
 * - sendPaginated(res, data, page, limit, total, message)
 */
export function sendPaginated(res, data, pageOrNum = 1, limit = 20, total = 0, message = null) {
  let pageMetadata = {};

  if (typeof pageOrNum === 'object' && pageOrNum !== null) {
    pageMetadata = {
      nextCursor: pageOrNum.nextCursor || null,
      hasMore: pageOrNum.hasMore || false,
      total: pageOrNum.total ?? undefined,
    };
  } else {
    const pageNum = parseInt(pageOrNum, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const totalNum = parseInt(total, 10) || (Array.isArray(data) ? data.length : 0);
    const hasMore = pageNum * limitNum < totalNum;

    pageMetadata = {
      page: pageNum,
      limit: limitNum,
      total: totalNum,
      hasMore,
    };
  }

  const body = {
    success: true,
    data,
    page: pageMetadata,
  };

  if (typeof message === 'string') {
    body.message = message;
  }

  return res.status(200).json(body);
}

/**
 * Success response for created resources
 */
export function sendCreated(res, data, message = null) {
  return sendSuccess(res, data, message || 'Created', 201);
}

/**
 * Standardized error response
 * Used by the error handler middleware — not typically called directly
 */
export function sendError(res, { code, message, details = null, statusCode = 500, requestId = null }) {
  const body = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details) {
    body.error.details = details;
  }

  if (requestId) {
    body.requestId = requestId;
  }

  return res.status(statusCode).json(body);
}
