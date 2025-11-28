import Conversation from '../models/Conversation.js';
import Product from '../models/Product.js';

/**
 * @desc    Create new conversation or get existing active conversation
 * @route   POST /api/chat/conversations
 * @access  Private
 */
export const createOrGetConversation = async (req, res) => {
  try {
    // Check if user has an active conversation
    let conversation = await Conversation.findOne({
      user: req.user.id,
      isActive: true,
    }).sort({ 'context.lastActivity': -1 });

    if (!conversation) {
      conversation = await Conversation.create({
        user: req.user.id,
        title: 'New Conversation',
        messages: [],
      });
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating conversation',
      error: error.message,
    });
  }
};

/**
 * @desc    Send message and get AI response with product suggestions
 * @route   POST /api/chat/conversations/:id/messages
 * @access  Private
 */
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const conversationId = req.params.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
    });

    // TODO: Integrate with AI service (OpenAI, etc.) for intelligent responses
    // For now, we'll use simple keyword matching for product suggestions

    const aiResponse = await generateAIResponse(message, conversation);
    const suggestedProducts = await suggestProductsBasedOnQuery(message);

    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      suggestedProducts: suggestedProducts.map((p) => p._id),
    });

    // Update context
    conversation.context.lastActivity = Date.now();
    await conversation.save();

    // Populate suggested products
    await conversation.populate({
      path: 'messages.suggestedProducts',
      select: 'name description price images platform externalUrl rating',
    });

    res.status(200).json({
      success: true,
      data: {
        conversation,
        suggestedProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all user conversations
 * @route   GET /api/chat/conversations
 * @access  Private
 */
export const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id })
      .sort({ 'context.lastActivity': -1 })
      .select('title createdAt context.lastActivity isActive messages');

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single conversation with full history
 * @route   GET /api/chat/conversations/:id
 * @access  Private
 */
export const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate({
      path: 'messages.suggestedProducts',
      select: 'name description price images platform externalUrl rating',
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
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete conversation
 * @route   DELETE /api/chat/conversations/:id
 * @access  Private
 */
export const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
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
    res.status(500).json({
      success: false,
      message: 'Error deleting conversation',
      error: error.message,
    });
  }
};

// Helper function to generate AI response (placeholder)
async function generateAIResponse(userMessage, _conversation) {
  const lowerMessage = userMessage.toLowerCase();

  // Simple keyword-based responses (replace with actual AI integration)
  if (
    lowerMessage.includes('laptop') ||
    lowerMessage.includes('computer')
  ) {
    return 'I\'d be happy to help you find a laptop! To give you the best recommendations, could you tell me:\n1. What\'s your budget range?\n2. What will you primarily use it for? (coding, gaming, general use, etc.)\n3. Do you have any brand preferences?\n\nI\'ve found some laptops that might interest you below.';
  }

  if (lowerMessage.includes('phone') || lowerMessage.includes('smartphone')) {
    return 'Looking for a new phone! Let me help you find the perfect one. Could you share:\n1. Your budget?\n2. Preferred brand (Apple, Samsung, etc.)?\n3. Key features you need (camera quality, battery life, etc.)?\n\nHere are some popular options I found:';
  }

  if (lowerMessage.includes('headphone') || lowerMessage.includes('earbuds')) {
    return 'Great! I can help you find the right headphones. Tell me:\n1. Your price range?\n2. Type (over-ear, in-ear, wireless)?\n3. Main use (music, gaming, calls)?\n\nCheck out these options:';
  }

  // Default response
  return 'I\'m here to help you find products from top e-commerce platforms like Jumia, Amazon, and more! What are you looking for today? You can ask about laptops, phones, electronics, clothing, and much more.';
}

// Helper function to suggest products based on query
async function suggestProductsBasedOnQuery(query) {
  try {
    const lowerQuery = query.toLowerCase();
    const keywords = [];

    // Extract keywords
    if (lowerQuery.includes('laptop')) {
      keywords.push('laptop', 'computer', 'notebook');
    }
    if (lowerQuery.includes('gaming')) {
      keywords.push('gaming');
    }
    if (lowerQuery.includes('phone')) {
      keywords.push('phone', 'smartphone');
    }
    if (lowerQuery.includes('headphone') || lowerQuery.includes('earbuds')) {
      keywords.push('headphone', 'earbuds', 'audio');
    }

    if (keywords.length === 0) {
      // Return some featured products
      return await Product.find({ featured: true }).limit(5);
    }

    // Search for products matching keywords
    const searchRegex = new RegExp(keywords.join('|'), 'i');
    const products = await Product.find({
      $or: [{ name: searchRegex }, { description: searchRegex }],
    })
      .limit(5)
      .sort({ rating: -1 });

    return products;
  } catch (error) {
    console.error('Error suggesting products:', error);
    return [];
  }
}
