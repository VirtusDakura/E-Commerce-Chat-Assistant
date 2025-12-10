/**
 * Zod Validation Schemas for Wishlist Endpoints
 */

import { z } from 'zod';

/**
 * MongoDB ObjectId validation
 */
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

/**
 * Priority enum
 */
const prioritySchema = z.enum(['high', 'medium', 'low']);

/**
 * Add to wishlist schema
 */
export const addToWishlistSchema = z.object({
  body: z.object({
    productId: objectIdSchema.describe('Product ID is required'),
    notes: z
      .string()
      .max(500, 'Notes cannot exceed 500 characters')
      .optional(),
    priority: prioritySchema.optional().default('medium'),
    priceAlertEnabled: z.boolean().optional().default(false),
    targetPrice: z
      .number()
      .min(0, 'Target price must be positive')
      .optional()
      .nullable(),
  }),
});

/**
 * Update wishlist item schema
 */
export const updateWishlistItemSchema = z.object({
  params: z.object({
    itemId: objectIdSchema,
  }),
  body: z.object({
    notes: z
      .string()
      .max(500, 'Notes cannot exceed 500 characters')
      .optional(),
    priority: prioritySchema.optional(),
    priceAlertEnabled: z.boolean().optional(),
    targetPrice: z
      .number()
      .min(0, 'Target price must be positive')
      .optional()
      .nullable(),
  }),
});

/**
 * Remove wishlist item schema
 */
export const removeWishlistItemSchema = z.object({
  params: z.object({
    itemId: objectIdSchema,
  }),
});

/**
 * Move to cart schema
 */
export const moveToCartSchema = z.object({
  params: z.object({
    itemId: objectIdSchema,
  }),
});

export default {
  addToWishlistSchema,
  updateWishlistItemSchema,
  removeWishlistItemSchema,
  moveToCartSchema,
};
