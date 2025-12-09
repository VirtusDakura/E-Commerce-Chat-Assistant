import api from './api';

export const cartService = {
  /**
   * Get user's cart
   * @returns {Promise} - Cart data
   */
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  /**
   * Add item to cart
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise} - Updated cart
   */
  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  /**
   * Update cart item quantity
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {Promise} - Updated cart
   */
  async updateQuantity(productId, quantity) {
    const response = await api.put('/cart/update', { productId, quantity });
    return response.data;
  },

  /**
   * Remove item from cart
   * @param {string} productId - Product ID
   * @returns {Promise} - Updated cart
   */
  async removeFromCart(productId) {
    const response = await api.delete(`/cart/remove/${productId}`);
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

  /**
   * Apply coupon code
   * @param {string} code - Coupon code
   * @returns {Promise} - Updated cart with discount
   */
  async applyCoupon(code) {
    const response = await api.post('/cart/coupon', { code });
    return response.data;
  },
};

export default cartService;
