/**
 * Zod Validation Schemas for Chat Endpoints
 */

import { z } from 'zod';

/**
 * Chat message schema
 */
export const chatMessageSchema = z.object({
  body: z.object({
    message: z
      .string({
        required_error: 'Message is required',
      })
      .min(1, 'Message cannot be empty')
      .max(2000, 'Message cannot exceed 2000 characters')
      .trim(),
    sessionId: z
      .string()
      .max(100, 'Session ID cannot exceed 100 characters')
      .optional(),
  }),
});

/**
 * Get conversation history schema
 */
export const getConversationSchema = z.object({
  params: z.object({
    sessionId: z
      .string({
        required_error: 'Session ID is required',
      })
      .min(1, 'Session ID is required'),
  }),
});

/**
 * Get user conversations schema (with pagination)
 */
export const getUserConversationsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().min(1, 'Page must be at least 1')),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .pipe(z.number().min(1).max(50, 'Limit cannot exceed 50')),
  }),
});

/**
 * Delete conversation schema
 */
export const deleteConversationSchema = z.object({
  params: z.object({
    sessionId: z
      .string({
        required_error: 'Session ID is required',
      })
      .min(1, 'Session ID is required'),
  }),
});

export default {
  chatMessageSchema,
  getConversationSchema,
  getUserConversationsSchema,
  deleteConversationSchema,
};
