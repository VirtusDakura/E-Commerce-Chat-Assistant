/**
 * Centralized Error Handler Middleware
 *
 * Handles all errors thrown in the application and returns consistent error responses.
 */

import { AppError, ValidationError } from '../errors/index.js';

/**
 * Development error response - includes stack trace
 */
const sendErrorDev = (err, res) => {
  const response = err instanceof AppError ? err.toJSON() : {
    success: false,
    error: {
      message: err.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    },
  };

  res.status(err.statusCode || 500).json({
    ...response,
    stack: err.stack,
  });
};

/**
 * Production error response - hides internal details
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Programming or unknown error: don't leak details
  console.error('ERROR 💥:', err);

  return res.status(500).json({
    success: false,
    error: {
      message: 'Something went wrong',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    },
  });
};

/**
 * Handle Mongoose CastError (invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'INVALID_ID');
};

/**
 * Handle Mongoose duplicate key error
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue?.[field];
  return new AppError(
    `Duplicate value for field '${field}': ${value}`,
    409,
    'DUPLICATE_FIELD',
  );
};

/**
 * Handle Mongoose validation error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return new ValidationError('Validation failed', errors);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401, 'INVALID_TOKEN');
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401, 'TOKEN_EXPIRED');
};

/**
 * Handle Zod validation errors
 */
const handleZodError = (err) => {
  const errors = err.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
  return new ValidationError('Validation failed', errors);
};

/**
 * Main error handler middleware
 */
export const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;

  // Log error for debugging
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[ERROR] ${err.statusCode} - ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
      console.error(err.stack);
    }
  }

  // Transform known error types
  let error = err;

  // Mongoose errors
  if (err.name === 'CastError') {
    error = handleCastErrorDB(err);
  }
  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }
  if (err.name === 'ValidationError' && err.errors) {
    error = handleValidationErrorDB(err);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    error = handleZodError(err);
  }

  // Send response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Catch async errors wrapper
 * Wraps async controller functions to catch errors and pass to error handler
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle unhandled routes
 */
export const notFoundHandler = (req, res, _next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      code: 'ROUTE_NOT_FOUND',
      statusCode: 404,
    },
  });
};

export default {
  errorHandler,
  catchAsync,
  notFoundHandler,
};
