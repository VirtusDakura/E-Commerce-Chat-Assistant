import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateWishlistItem,
  moveToCart,
  clearWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.put('/:itemId', updateWishlistItem);
router.delete('/:itemId', removeFromWishlist);
router.delete('/', clearWishlist);
router.post('/move-to-cart', moveToCart);

export default router;
