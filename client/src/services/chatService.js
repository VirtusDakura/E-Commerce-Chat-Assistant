import api from './api';

export const chatService = {
  /**
   * Send message to AI and get response
   * @param {string} message - User message
   * @param {string} sessionId - Session ID for conversation continuity
   * @returns {Promise} - AI response with recommendations
   */
  async sendMessage(message, sessionId = null) {
    const response = await api.post('/chat', {
      message,
      sessionId,
    });
    return response.data;
  },

  /**
   * Get all user conversations
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} - List of conversations
   */
  async getConversations(page = 1, limit = 10) {
    const response = await api.get('/chat/conversations', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get conversation history by session ID
   * @param {string} sessionId - Session ID
   * @returns {Promise} - Conversation with messages
   */
  async getConversation(sessionId) {
    const response = await api.get(`/chat/conversations/${sessionId}`);
    return response.data;
  },

  /**
   * Delete a conversation
   * @param {string} sessionId - Session ID
   * @returns {Promise}
   */
  async deleteConversation(sessionId) {
    const response = await api.delete(`/chat/conversations/${sessionId}`);
    return response.data;
  },
};

export default chatService;
