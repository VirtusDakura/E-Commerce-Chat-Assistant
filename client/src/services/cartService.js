import api from './api';

export const cartService = {
  /**
   * Get user's cart
   * @returns {Promise} - Cart data with platform groups
   */
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  /**
   * Add item to cart
   * @param {string} productId - Product ID (MongoDB _id)
   * @param {number} quantity - Quantity to add
   * @returns {Promise} - Updated cart
   */
  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  /**
   * Update cart item quantity
   * @param {string} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise} - Updated cart
   */
  async updateQuantity(itemId, quantity) {
    const response = await api.put(`/cart/update/${itemId}`, { quantity });
    return response.data;
  },

  /**
   * Remove item from cart
   * @param {string} itemId - Cart item ID
   * @returns {Promise} - Updated cart
   */
  async removeFromCart(itemId) {
    const response = await api.delete(`/cart/remove/${itemId}`);
    return response.data;
  },

  /**
   * Clear entire cart
   * @returns {Promise}
   */
  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

export default cartService;
