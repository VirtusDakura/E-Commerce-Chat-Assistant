/**
 * Custom Error Classes for E-Commerce Chat Assistant
 *
 * Centralized error handling with proper HTTP status codes and error types.
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Distinguishes operational errors from programming errors
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        code: this.errorCode,
        statusCode: this.statusCode,
        timestamp: this.timestamp,
      },
    };
  }
}

/**
 * Validation error - 400 Bad Request
 */
export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors; // Array of field-level errors
  }

  toJSON() {
    return {
      ...super.toJSON(),
      error: {
        ...super.toJSON().error,
        validationErrors: this.errors,
      },
    };
  }
}

/**
 * Authentication error - 401 Unauthorized
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Authorization error - 403 Forbidden
 */
export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * Not found error - 404 Not Found
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource', identifier = '') {
    const message = identifier
      ? `${resource} not found: ${identifier}`
      : `${resource} not found`;
    super(message, 404, 'NOT_FOUND');
    this.resource = resource;
    this.identifier = identifier;
  }
}

/**
 * Conflict error - 409 Conflict
 */
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * Rate limit error - 429 Too Many Requests
 */
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please try again later', retryAfter = 60) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.retryAfter = retryAfter;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      error: {
        ...super.toJSON().error,
        retryAfter: this.retryAfter,
      },
    };
  }
}

/**
 * External service error - 502 Bad Gateway
 */
export class ExternalServiceError extends AppError {
  constructor(serviceName, message = 'External service unavailable') {
    super(`${serviceName}: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR');
    this.serviceName = serviceName;
  }
}

/**
 * Scraping error - specific to web scraping failures
 */
export class ScrapingError extends ExternalServiceError {
  constructor(marketplace, message = 'Failed to scrape data') {
    super(marketplace, message);
    this.errorCode = 'SCRAPING_ERROR';
    this.marketplace = marketplace;
  }
}

/**
 * AI/LLM service error
 */
export class LLMError extends ExternalServiceError {
  constructor(provider, message = 'LLM service error') {
    super(provider, message);
    this.errorCode = 'LLM_ERROR';
    this.provider = provider;
  }
}

/**
 * Database error - 500 Internal Server Error
 */
export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

export default {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ExternalServiceError,
  ScrapingError,
  LLMError,
  DatabaseError,
};
