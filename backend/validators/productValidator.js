/**
 * Zod Validation Schemas for Product Endpoints
 */

import { z } from 'zod';

/**
 * MongoDB ObjectId validation
 */
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

/**
 * Marketplace enum
 */
const marketplaceSchema = z.enum(['jumia', 'amazon', 'aliexpress', 'ebay', 'other']);

/**
 * Get all products schema (with filtering and pagination)
 */
export const getAllProductsSchema = z.object({
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
    sort: z.string().optional(),
    search: z.string().max(200).optional(),
    category: z.string().optional(),
    'price[gte]': z.string().optional(),
    'price[lte]': z.string().optional(),
    'price[gt]': z.string().optional(),
    'price[lt]': z.string().optional(),
  }).passthrough(), // Allow additional query params
});

/**
 * Get product by ID schema
 */
export const getProductByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

/**
 * Search products schema
 */
export const searchProductsSchema = z.object({
  query: z.object({
    q: z.string().max(200, 'Search query cannot exceed 200 characters').optional(),
    category: z.string().optional(),
    minPrice: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(z.number().min(0).optional()),
    maxPrice: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(z.number().min(0).optional()),
    minRating: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(z.number().min(0).max(5).optional()),
    inStock: z.enum(['true', 'false']).optional(),
    brand: z.string().optional(),
    sort: z.enum(['price-asc', 'price-desc', 'rating-desc', 'newest', 'name-asc', 'name-desc']).optional(),
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
  }),
});

/**
 * Compare products schema
 */
export const compareProductsSchema = z.object({
  body: z.object({
    productIds: z
      .array(objectIdSchema)
      .min(2, 'Please provide at least 2 product IDs to compare')
      .max(5, 'Cannot compare more than 5 products at once'),
  }),
});

/**
 * Search Jumia products schema
 */
export const searchJumiaSchema = z.object({
  query: z.object({
    q: z
      .string({
        required_error: 'Search query (q) is required',
      })
      .min(1, 'Search query is required')
      .max(200, 'Search query cannot exceed 200 characters'),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().min(1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 24))
      .pipe(z.number().min(1).max(50)),
  }),
});

/**
 * Get product by marketplace ID schema
 */
export const getByMarketplaceIdSchema = z.object({
  params: z.object({
    marketplace: marketplaceSchema,
    productId: z.string().min(1, 'Product ID is required'),
  }),
});

/**
 * Refresh product data schema
 */
export const refreshProductSchema = z.object({
  params: z.object({
    marketplace: marketplaceSchema,
    productId: z.string().min(1, 'Product ID is required'),
  }),
});

export default {
  getAllProductsSchema,
  getProductByIdSchema,
  searchProductsSchema,
  compareProductsSchema,
  searchJumiaSchema,
  getByMarketplaceIdSchema,
  refreshProductSchema,
};
