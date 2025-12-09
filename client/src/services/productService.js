import api from './api';

export const productService = {
  /**
   * Get all products with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} - Products list
   */
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /**
   * Get single product by ID
   * @param {string} id - Product ID
   * @returns {Promise} - Product details
   */
  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Search products
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} - Search results
   */
  async searchProducts(query, filters = {}) {
    const response = await api.get('/products/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  /**
   * Get products by category
   * @param {string} category - Category name/slug
   * @param {Object} params - Additional parameters
   * @returns {Promise} - Products list
   */
  async getProductsByCategory(category, params = {}) {
    const response = await api.get(`/products/category/${category}`, { params });
    return response.data;
  },

  /**
   * Get featured products
   * @returns {Promise} - Featured products
   */
  async getFeaturedProducts() {
    const response = await api.get('/products/featured');
    return response.data;
  },

  /**
   * Get product reviews
   * @param {string} productId - Product ID
   * @returns {Promise} - Reviews list
   */
  async getProductReviews(productId) {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  },

  /**
   * Add product review
   * @param {string} productId - Product ID
   * @param {Object} review - Review data { rating, comment }
   * @returns {Promise} - Created review
   */
  async addProductReview(productId, review) {
    const response = await api.post(`/products/${productId}/reviews`, review);
    return response.data;
  },
};

export default productService;
