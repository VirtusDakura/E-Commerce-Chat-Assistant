/**
 * Re-export all validators from a single entry point
 */

export { validate } from './validate.js';

// Auth validators
export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './authValidator.js';

// Chat validators
export {
  chatMessageSchema,
  getConversationSchema,
  getUserConversationsSchema,
  deleteConversationSchema,
} from './chatValidator.js';

// Product validators
export {
  getAllProductsSchema,
  getProductByIdSchema,
  searchProductsSchema,
  compareProductsSchema,
  searchJumiaSchema,
  getByMarketplaceIdSchema,
  refreshProductSchema,
} from './productValidator.js';

// Cart validators
export {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from './cartValidator.js';

// Wishlist validators
export {
  addToWishlistSchema,
  updateWishlistItemSchema,
  removeWishlistItemSchema,
  moveToCartSchema,
} from './wishlistValidator.js';

// User validators
export {
  updateProfileSchema,
  changePasswordSchema,
} from './userValidator.js';

// Admin validators
export {
  getAllUsersSchema,
  getUserByIdSchema,
  updateUserSchema,
  deleteUserSchema,
} from './adminValidator.js';
