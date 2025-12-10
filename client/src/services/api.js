import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle new error response format from backend
    const errorData = error.response?.data;
    
    if (error.response?.status === 401) {
      // Check for token invalidation message
      const isTokenInvalid = errorData?.message?.includes('invalidated') || 
                             errorData?.message?.includes('expired');
      if (isTokenInvalid) {
        localStorage.removeItem('auth-token');
        window.location.href = '/login';
      }
    }
    
    // Extract validation errors if present
    if (errorData?.error?.validationErrors) {
      error.validationErrors = errorData.error.validationErrors;
    }
    
    return Promise.reject(error);
  }
);

// ============ AUTH API ============
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwords) => api.put('/users/change-password', passwords),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};

// ============ CHAT API ============
export const chatAPI = {
  sendMessage: (message, sessionId = null) => api.post('/chat', { message, sessionId }),
  getConversations: (page = 1, limit = 10) => api.get('/chat/conversations', { params: { page, limit } }),
  getHistory: (page = 1, limit = 20) => api.get('/chat/conversations', { params: { page, limit } }).then(res => res.data || []),
  getConversation: (sessionId) => api.get(`/chat/conversations/${sessionId}`).then(res => res.data),
  deleteConversation: (sessionId) => api.delete(`/chat/conversations/${sessionId}`),
};

// ============ CART API ============
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
  updateQuantity: (itemId, quantity) => api.put(`/cart/update/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// ============ WISHLIST API ============
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId, options = {}) => api.post('/wishlist', { productId, ...options }),
  removeFromWishlist: (itemId) => api.delete(`/wishlist/${itemId}`),
  clearWishlist: () => api.delete('/wishlist'),
};

// ============ PRODUCT API ============
export const productAPI = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (marketplace, productId) => api.get(`/products/${marketplace}/${productId}`),
  searchProducts: (query, filters = {}) => api.get('/products/search', { params: { q: query, ...filters } }),
  getFeaturedProducts: () => api.get('/products/featured'),
  searchJumia: (query) => api.get('/products/jumia/search', { params: { q: query } }),
};

export default api;
