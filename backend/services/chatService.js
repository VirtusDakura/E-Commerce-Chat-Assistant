/**
 * Chat Service
 *
 * Orchestrates AI processing, product search, and conversation management.
 */

import Conversation from '../models/Conversation.js';
import { geminiAdapter } from '../adapters/llm/index.js';
import { searchProducts, enrichProductsWithDbIds } from './scrapingService.js';
import { NotFoundError } from '../errors/index.js';
import { LLM_ACTIONS } from '../config/llm.js';

/**
 * Process a chat message and return response with recommendations
 * @param {Object} params - Chat parameters
 * @param {string} params.userId - User ID
 * @param {string} params.message - User's message
 * @param {string} params.sessionId - Optional session ID
 * @returns {Promise<Object>} - Chat response with recommendations
 */
export async function processChat({ userId, message, sessionId }) {
  // Find or create conversation
  const conversation = await findOrCreateConversation(userId, sessionId);

  // Build conversation history for AI
  const conversationHistory = conversation.messages.slice(-6).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Add user message to conversation
  conversation.messages.push({
    role: 'user',
    content: message,
    metadata: {
      timestamp: Date.now(),
    },
  });

  // Process message with AI
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[ChatService] Processing message for user ${userId}: "${message}"`);
  }
  const aiResponse = await geminiAdapter.processMessage(message, conversationHistory);

  if (process.env.NODE_ENV !== 'production') {
    console.log('[ChatService] AI Response:', JSON.stringify(aiResponse, null, 2));
  }

  let products = [];
  let productsWithDbIds = [];
  let productIds = [];

  // If AI wants to search products
  if (aiResponse.action === LLM_ACTIONS.SEARCH_PRODUCTS && aiResponse.query) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[ChatService] Triggering search for: "${aiResponse.query}"`);
    }

    try {
      products = await searchProducts(aiResponse.query, {
        marketplace: 'jumia',
        page: 1,
        limit: 12,
      });

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[ChatService] Found ${products.length} products`);
      }

      // Get products with DB IDs for cart/wishlist
      productsWithDbIds = await enrichProductsWithDbIds(products);
      productIds = productsWithDbIds.map(p => p._id).filter(Boolean);
    } catch (searchError) {
      console.error('[ChatService] Search error:', searchError.message);
      aiResponse.reply = `I had trouble searching right now. ${searchError.message}. Could you try rephrasing?`;
    }
  }

  // Add assistant message to conversation
  conversation.messages.push({
    role: 'assistant',
    content: aiResponse.reply,
    metadata: {
      action: aiResponse.action,
      query: aiResponse.query,
      productsCount: products.length,
    },
    suggestedProducts: productIds,
  });

  // Update conversation context
  conversation.context.lastActivity = Date.now();
  if (aiResponse.action === LLM_ACTIONS.SEARCH_PRODUCTS) {
    conversation.intent = 'shopping';
    conversation.context.searchIntent = aiResponse.query;
  }

  await conversation.save();

  // Format response
  const recommendations = formatRecommendations(productsWithDbIds);

  return {
    action: aiResponse.action,
    reply: aiResponse.reply,
    recommendations,
    conversationId: conversation._id,
    sessionId: conversation.sessionId,
    metadata: {
      productsCount: recommendations.length,
      searchQuery: aiResponse.query,
    },
  };
}

/**
 * Find or create a conversation
 * @param {string} userId - User ID
 * @param {string} sessionId - Optional session ID
 * @returns {Promise<Object>} - Conversation document
 */
async function findOrCreateConversation(userId, sessionId) {
  let conversation = null;

  if (sessionId) {
    conversation = await Conversation.findOne({
      sessionId,
      user: userId,
    });
  }

  if (!conversation) {
    conversation = await Conversation.create({
      user: userId,
      sessionId: sessionId || `session-${Date.now()}-${userId}`,
      messages: [],
      intent: null,
      context: {
        userPreferences: {},
        searchIntent: '',
        lastActivity: Date.now(),
        marketplace: 'jumia',
      },
    });
  }

  return conversation;
}

/**
 * Format products for response
 * @param {Array} products - Products with DB IDs
 * @returns {Array} - Formatted recommendations
 */
function formatRecommendations(products) {
  return products.map((product) => ({
    _id: product._id,
    marketplace: product.marketplace,
    productId: product.productId,
    title: product.title,
    price: product.price,
    currency: product.currency,
    image: product.image,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    productUrl: product.productUrl,
    quickActions: {
      addToCart: '/api/cart/add',
      addToWishlist: '/api/wishlist/add',
      viewOnJumia: product.productUrl,
    },
  }));
}

/**
 * Get conversation history by session ID
 * @param {string} userId - User ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - Conversation with populated products
 */
export async function getConversationHistory(userId, sessionId) {
  const conversation = await Conversation.findOne({
    sessionId,
    user: userId,
  }).populate({
    path: 'messages.suggestedProducts',
    select: 'name price currency images marketplace productId productUrl',
  });

  if (!conversation) {
    throw new NotFoundError('Conversation', sessionId);
  }

  return conversation;
}

/**
 * Get all conversations for a user
 * @param {string} userId - User ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Paginated conversations
 */
export async function getUserConversations(userId, { page = 1, limit = 10 } = {}) {
  const skip = (page - 1) * limit;

  const conversations = await Conversation.find({ user: userId })
    .sort({ 'context.lastActivity': -1 })
    .limit(limit)
    .skip(skip)
    .select('sessionId intent context.lastActivity messages');

  const total = await Conversation.countDocuments({ user: userId });

  return {
    conversations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Delete a conversation
 * @param {string} userId - User ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteConversation(userId, sessionId) {
  const conversation = await Conversation.findOneAndDelete({
    sessionId,
    user: userId,
  });

  if (!conversation) {
    throw new NotFoundError('Conversation', sessionId);
  }

  return true;
}

export default {
  processChat,
  getConversationHistory,
  getUserConversations,
  deleteConversation,
};
