/**
 * Validation Middleware
 *
 * Validates request data against Zod schemas.
 */

import { ValidationError } from '../errors/index.js';
import { ZodError } from 'zod';

/**
 * Create validation middleware from a Zod schema
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate the request against the schema
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace request data with validated data
      req.body = validated.body ?? req.body;
      req.query = validated.query ?? req.query;
      req.params = validated.params ?? req.params;

      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        // Zod v4 uses error.issues array
        const issues = error.issues || error.errors || [];
        const errors = issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        return next(new ValidationError('Validation failed', errors));
      }

      next(error);
    }
  };
};

export default validate;
