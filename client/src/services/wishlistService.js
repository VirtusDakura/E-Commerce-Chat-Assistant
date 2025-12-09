import api from './api';

export const wishlistService = {
  /**
   * Get user's wishlist
   * @returns {Promise} - Wishlist items with price change tracking
   */
  async getWishlist() {
    const response = await api.get('/wishlist');
    return response.data;
  },

  /**
   * Add item to wishlist
   * @param {string} productId - Product ID (MongoDB _id)
   * @param {Object} options - Optional: notes, priority, priceAlertEnabled, targetPrice
   * @returns {Promise} - Updated wishlist
   */
  async addToWishlist(productId, options = {}) {
    const response = await api.post('/wishlist', { productId, ...options });
    return response.data;
  },

  /**
   * Remove item from wishlist
   * @param {string} itemId - Wishlist item ID
   * @returns {Promise} - Updated wishlist
   */
  async removeFromWishlist(itemId) {
    const response = await api.delete(`/wishlist/${itemId}`);
    return response.data;
  },

  /**
   * Clear entire wishlist
   * @returns {Promise}
   */
  async clearWishlist() {
    const response = await api.delete('/wishlist');
    return response.data;
  },
};

export default wishlistService;
