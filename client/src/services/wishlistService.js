import api from './api';

export const wishlistService = {
  /**
   * Get user's wishlist
   * @returns {Promise} - Wishlist items
   */
  async getWishlist() {
    const response = await api.get('/wishlist');
    return response.data;
  },

  /**
   * Add item to wishlist
   * @param {string} productId - Product ID
   * @returns {Promise} - Updated wishlist
   */
  async addToWishlist(productId) {
    const response = await api.post('/wishlist/add', { productId });
    return response.data;
  },

  /**
   * Remove item from wishlist
   * @param {string} productId - Product ID
   * @returns {Promise} - Updated wishlist
   */
  async removeFromWishlist(productId) {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  },

  /**
   * Check if product is in wishlist
   * @param {string} productId - Product ID
   * @returns {Promise} - Boolean
   */
  async isInWishlist(productId) {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data.isInWishlist;
  },

  /**
   * Move item from wishlist to cart
   * @param {string} productId - Product ID
   * @returns {Promise}
   */
  async moveToCart(productId) {
    const response = await api.post('/wishlist/move-to-cart', { productId });
    return response.data;
  },

  /**
   * Clear entire wishlist
   * @returns {Promise}
   */
  async clearWishlist() {
    const response = await api.delete('/wishlist/clear');
    return response.data;
  },
};

export default wishlistService;
