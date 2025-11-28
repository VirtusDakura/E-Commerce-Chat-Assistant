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

const router = express.Router();

// Public routes - Read-only access to products from external platforms
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.post('/compare', compareProducts);

// Jumia-specific routes
router.get('/jumia/search', searchJumiaProducts);
router.get('/redirect/:marketplace/:productId', redirectToProduct);
router.get('/:marketplace/:productId', getProductByMarketplaceId);

// Admin routes
router.post('/refresh/:marketplace/:productId', protect, authorize('admin'), refreshProductData);

// Legacy route (keep for backward compatibility)
router.get('/:id', getProductById);

export default router;
