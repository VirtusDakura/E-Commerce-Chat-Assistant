import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../validators/validate.js';
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from '../validators/cartValidator.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/add', validate(addToCartSchema), addToCart);
router.put('/update/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/remove/:itemId', validate(removeCartItemSchema), removeFromCart);
router.delete('/clear', clearCart);

export default router;
