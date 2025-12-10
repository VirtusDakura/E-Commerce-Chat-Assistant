import express from 'express';
import {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  searchProducts,
  compareProducts,
  searchJumiaProducts,
  getProductByMarketplaceId,
  refreshProductData,
  redirectToProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { scrapingLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../validators/validate.js';
import {
  getAllProductsSchema,
  getProductByIdSchema,
  searchProductsSchema,
  compareProductsSchema,
  searchJumiaSchema,
  getByMarketplaceIdSchema,
  refreshProductSchema,
} from '../validators/productValidator.js';

const router = express.Router();

// Public routes - Read-only access to products from external platforms
router.get('/', validate(getAllProductsSchema), getAllProducts);
router.get('/search', validate(searchProductsSchema), searchProducts);
router.get('/featured', getFeaturedProducts);
router.post('/compare', validate(compareProductsSchema), compareProducts);

// Jumia-specific routes (with scraping rate limiter)
router.get('/jumia/search', scrapingLimiter, validate(searchJumiaSchema), searchJumiaProducts);
router.get('/redirect/:marketplace/:productId', validate(getByMarketplaceIdSchema), redirectToProduct);
router.get('/:marketplace/:productId', validate(getByMarketplaceIdSchema), getProductByMarketplaceId);

// Admin routes
router.post('/refresh/:marketplace/:productId', protect, authorize('admin'), validate(refreshProductSchema), refreshProductData);

// Legacy route (keep for backward compatibility)
router.get('/:id', validate(getProductByIdSchema), getProductById);

export default router;
