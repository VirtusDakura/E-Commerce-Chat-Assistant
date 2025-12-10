/**
 * Zod Validation Schemas for Admin Endpoints
 */

import { z } from 'zod';

/**
 * MongoDB ObjectId validation
 */
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

/**
 * User role enum
 */
const roleSchema = z.enum(['user', 'admin']);

/**
 * Get all users schema (with pagination)
 */
export const getAllUsersSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().min(1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .pipe(z.number().min(1).max(100)),
    role: roleSchema.optional(),
  }),
});

/**
 * Get user by ID schema
 */
export const getUserByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

/**
 * Update user schema
 */
export const updateUserSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .trim()
      .optional(),
    email: z
      .string()
      .email('Please provide a valid email')
      .toLowerCase()
      .trim()
      .optional(),
    role: roleSchema.optional(),
  }),
});

/**
 * Delete user schema
 */
export const deleteUserSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export default {
  getAllUsersSchema,
  getUserByIdSchema,
  updateUserSchema,
  deleteUserSchema,
};
