/**
 * Zod Validation Schemas for Cart Endpoints
 */

import { z } from 'zod';

/**
 * MongoDB ObjectId validation
 */
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

/**
 * Add to cart schema
 */
export const addToCartSchema = z.object({
  body: z.object({
    productId: objectIdSchema.describe('Product ID is required'),
    quantity: z
      .number()
      .int('Quantity must be a whole number')
      .min(1, 'Quantity must be at least 1')
      .max(99, 'Quantity cannot exceed 99')
      .optional()
      .default(1),
  }),
});

/**
 * Update cart item schema
 */
export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: objectIdSchema,
  }),
  body: z.object({
    quantity: z
      .number({
        required_error: 'Quantity is required',
      })
      .int('Quantity must be a whole number')
      .min(1, 'Quantity must be at least 1')
      .max(99, 'Quantity cannot exceed 99'),
  }),
});

/**
 * Remove cart item schema
 */
export const removeCartItemSchema = z.object({
  params: z.object({
    itemId: objectIdSchema,
  }),
});

export default {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
};
