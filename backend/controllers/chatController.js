import Conversation from '../models/Conversation.js';
import Product from '../models/Product.js';
import { processMessage } from '../services/aiService.js';
import { searchJumia } from '../services/jumiaService.js';

/**
 * Main Chat Endpoint - Integrates Gemini AI with Jumia Search
 * @route   POST /api/chat
 * @access  Private
 */
export async function chat(req, res, next) {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user?.id || req.user?._id;

    // Validation
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Find or create conversation
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

    // Build conversation history for AI
    const conversationHistory = conversation.messages.slice(-6).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add current user message
    conversation.messages.push({
      role: 'user',
      content: message,
      metadata: {
        timestamp: Date.now(),
      },
    });

    // Process message with Gemini AI
    console.log(`[Chat] Processing message for user ${userId}: "${message}"`);
    const aiResponse = await processMessage(message, conversationHistory);

    console.log('[Chat] AI Response:', aiResponse);

    let products = [];
    let productIds = [];

    // If AI wants to search products
    if (aiResponse.action === 'search_products' && aiResponse.query) {
      console.log(`[Chat] Searching Jumia for: "${aiResponse.query}"`);

      try {
        // Search Jumia
        products = await searchJumia(aiResponse.query, {
          page: 1,
          limit: 12,
        });

        console.log(`[Chat] Found ${products.length} products`);

        // Get product IDs from database (products are cached by jumiaService)
        const productPromises = products.map(async (p) => {
          const dbProduct = await Product.findOne({
            marketplace: p.marketplace,
            productId: p.productId,
          });
          return dbProduct?._id;
        });

        productIds = (await Promise.all(productPromises)).filter(Boolean);
      } catch (searchError) {
        console.error('[Chat] Jumia search error:', searchError.message);
        aiResponse.reply = `I had trouble searching Jumia right now. ${searchError.message}. Could you try rephrasing your search?`;
      }
    }

    // Add assistant message
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
    if (aiResponse.action === 'search_products') {
      conversation.intent = 'shopping';
      conversation.context.searchIntent = aiResponse.query;
    }

    await conversation.save();

    // Format response
    const recommendations = products.map((product) => ({
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

    res.status(200).json({
      success: true,
      action: aiResponse.action,
      reply: aiResponse.reply,
      recommendations,
      conversationId: conversation._id,
      sessionId: conversation.sessionId,
      metadata: {
        productsCount: recommendations.length,
        searchQuery: aiResponse.query,
      },
    });
  } catch (error) {
    console.error('[Chat] Error:', error);
    next(error);
  }
}

/**
 * Get conversation history
 * @route   GET /api/chat/conversations/:sessionId
 * @access  Private
 */
export async function getConversationHistory(req, res, next) {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id || req.user?._id;

    const conversation = await Conversation.findOne({
      sessionId,
      user: userId,
    }).populate({
      path: 'messages.suggestedProducts',
      select: 'name price currency images marketplace productId productUrl',
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('[Chat] Get conversation error:', error);
    next(error);
  }
}

/**
 * Get all user conversations
 * @route   GET /api/chat/conversations
 * @access  Private
 */
export async function getUserConversations(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    const { page = 1, limit = 10 } = req.query;

    const conversations = await Conversation.find({ user: userId })
      .sort({ 'context.lastActivity': -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('sessionId intent context.lastActivity messages');

    const total = await Conversation.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: conversations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('[Chat] Get conversations error:', error);
    next(error);
  }
}

/**
 * Delete conversation
 * @route   DELETE /api/chat/conversations/:sessionId
 * @access  Private
 */
export async function deleteConversation(req, res, next) {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id || req.user?._id;

    const conversation = await Conversation.findOneAndDelete({
      sessionId,
      user: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    console.error('[Chat] Delete conversation error:', error);
    next(error);
  }
}

export default {
  chat,
  getConversationHistory,
  getUserConversations,
  deleteConversation,
};
