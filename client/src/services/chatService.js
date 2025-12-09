import api from './api';
import { delay, generateId } from '../lib/utils';

// Mock AI responses for development
const mockResponses = [
  {
    type: 'text',
    content: "I'd be happy to help you find the perfect product! What are you looking for today?",
  },
  {
    type: 'products',
    content: "Based on your preferences, here are some products I recommend:",
    products: [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        rating: 4.5,
        category: 'Electronics',
      },
      {
        id: '2',
        name: 'Smart Watch Pro',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
        rating: 4.8,
        category: 'Electronics',
      },
      {
        id: '3',
        name: 'Portable Bluetooth Speaker',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
        rating: 4.3,
        category: 'Electronics',
      },
    ],
  },
  {
    type: 'text',
    content: "That's a great choice! This product has excellent reviews and is currently on sale. Would you like me to add it to your cart?",
  },
  {
    type: 'text',
    content: "I can help you compare different products, find the best deals, or answer any questions about specifications. Just let me know!",
  },
  {
    type: 'products',
    content: "Here are some trending fashion items you might like:",
    products: [
      {
        id: '4',
        name: 'Classic Denim Jacket',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
        rating: 4.6,
        category: 'Fashion',
      },
      {
        id: '5',
        name: 'Premium Cotton T-Shirt',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
        rating: 4.4,
        category: 'Fashion',
      },
    ],
  },
];

export const chatService = {
  /**
   * Send message to AI and get response
   * @param {string} message - User message
   * @param {string} conversationId - Conversation ID
   * @returns {Promise} - AI response
   */
  async sendMessage(message, conversationId) {
    try {
      const response = await api.post('/chat/message', {
        message,
        conversationId,
      });
      return response.data;
    } catch (error) {
      // Fall back to mock response if API fails
      await delay(1000 + Math.random() * 1500);
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      return {
        id: generateId(),
        ...randomResponse,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Get conversation history
   * @param {string} conversationId - Conversation ID
   * @returns {Promise} - Messages list
   */
  async getConversation(conversationId) {
    try {
      const response = await api.get(`/chat/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      return { messages: [] };
    }
  },

  /**
   * Create new conversation
   * @returns {Promise} - New conversation data
   */
  async createConversation() {
    try {
      const response = await api.post('/chat/conversation');
      return response.data;
    } catch (error) {
      return { id: generateId(), messages: [] };
    }
  },

  /**
   * Delete conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise}
   */
  async deleteConversation(conversationId) {
    const response = await api.delete(`/chat/conversation/${conversationId}`);
    return response.data;
  },

  /**
   * Get AI product recommendations
   * @param {Object} preferences - User preferences
   * @returns {Promise} - Recommended products
   */
  async getRecommendations(preferences) {
    try {
      const response = await api.post('/chat/recommendations', preferences);
      return response.data;
    } catch (error) {
      await delay(800);
      return mockResponses.find(r => r.type === 'products');
    }
  },
};

export default chatService;
