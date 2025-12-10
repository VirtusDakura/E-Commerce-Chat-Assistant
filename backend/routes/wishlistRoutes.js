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
import { validate } from '../validators/validate.js';
import {
  addToWishlistSchema,
  updateWishlistItemSchema,
  removeWishlistItemSchema,
  moveToCartSchema,
} from '../validators/wishlistValidator.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

router.get('/', getWishlist);
router.post('/', validate(addToWishlistSchema), addToWishlist);
router.put('/:itemId', validate(updateWishlistItemSchema), updateWishlistItem);
router.delete('/:itemId', validate(removeWishlistItemSchema), removeFromWishlist);
router.delete('/', clearWishlist);
router.post('/move-to-cart', validate(moveToCartSchema), moveToCart);

export default router;
