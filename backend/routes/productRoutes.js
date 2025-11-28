import express from 'express';
import {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  searchProducts,
} from '../controllers/productController.js';

const router = express.Router();

// Public routes - Read-only access to products from external platforms
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

export default router;
