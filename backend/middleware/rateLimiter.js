/**
 * Rate Limiting Middleware
 *
 * Configurable rate limiters for different endpoint types.
 */

import rateLimit from 'express-rate-limit';
import { RateLimitError } from '../errors/index.js';

/**
 * Default rate limit error handler
 */
const rateLimitHandler = (req, res, _next, options) => {
  const error = new RateLimitError(
    options.message || 'Too many requests, please try again later',
    Math.ceil(options.windowMs / 1000),
  );

  res.status(429).json(error.toJSON());
};

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: rateLimitHandler,
  skip: () => process.env.NODE_ENV === 'test', // Skip in test environment
});

/**
 * Authentication rate limiter (stricter)
 * 10 requests per 15 minutes for login/register/password reset
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many authentication attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: () => process.env.NODE_ENV === 'test',
});

/**
 * Chat/AI rate limiter
 * 30 requests per minute (to protect AI API usage)
 */
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: 'Too many chat requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: () => process.env.NODE_ENV === 'test',
});

/**
 * Scraping rate limiter
 * 20 requests per minute (to avoid overwhelming external sites)
 */
export const scrapingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: 'Too many search requests, please try again in a minute',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: () => process.env.NODE_ENV === 'test',
});

/**
 * Admin rate limiter
 * 50 requests per 15 minutes
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: 'Too many admin requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: () => process.env.NODE_ENV === 'test',
});

/**
 * Create a custom rate limiter
 * @param {Object} options - Rate limiter options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests per window
 * @param {string} options.message - Error message
 * @returns {Function} Express middleware
 */
export const createLimiter = ({ windowMs, max, message }) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    skip: () => process.env.NODE_ENV === 'test',
  });
};

export default {
  generalLimiter,
  authLimiter,
  chatLimiter,
  scrapingLimiter,
  adminLimiter,
  createLimiter,
};
