import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { sendError } from '../utils/response.js';

// Catches all errors and sends standardized error responses
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.message, err.code);
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 400, 'Invalid JSON body', 'INVALID_JSON');
    return;
  }

  const statusCode = 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  sendError(res, statusCode, message, 'INTERNAL_ERROR');
};

// 404 Not Found handler for undefined routes
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found`, 'ROUTE_NOT_FOUND');
};
