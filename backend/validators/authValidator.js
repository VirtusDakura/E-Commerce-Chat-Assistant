/**
 * Zod Validation Schemas for Authentication Endpoints
 */

import { z } from 'zod';

/**
 * Register user schema
 */
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .trim(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email')
      .toLowerCase()
      .trim(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password cannot exceed 128 characters'),
  }),
});

/**
 * Login user schema
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email')
      .toLowerCase()
      .trim(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(1, 'Password is required'),
  }),
});

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email')
      .toLowerCase()
      .trim(),
  }),
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string({
      required_error: 'Reset token is required',
    }),
  }),
  body: z.object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password cannot exceed 128 characters'),
  }),
});

export default {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
