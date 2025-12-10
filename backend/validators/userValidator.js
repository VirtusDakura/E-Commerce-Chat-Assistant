/**
 * Zod Validation Schemas for User Endpoints
 */

import { z } from 'zod';

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
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
  }).refine((data) => data.name || data.email, {
    message: 'At least one field (name or email) must be provided',
  }),
});

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({
        required_error: 'Current password is required',
      })
      .min(1, 'Current password is required'),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, 'New password must be at least 6 characters')
      .max(128, 'Password cannot exceed 128 characters'),
  }),
});

export default {
  updateProfileSchema,
  changePasswordSchema,
};
