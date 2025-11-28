import express from 'express';
import {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  searchProducts,
  compareProducts,
} from '../controllers/productController.js';

const router = express.Router();

// Public routes - Read-only access to products from external platforms
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.post('/compare', compareProducts);
router.get('/:id', getProductById);

export default router;
