import OpenAI from 'openai';
import Product from '../models/Product.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate intelligent chat response using GPT-4
 */
export const generateChatResponse = async (userMessage, conversationHistory, _userId) => {
  try {
    // Build context from conversation history
    const messages = [
      {
        role: 'system',
        content: `You are a helpful e-commerce shopping assistant that helps users find products from platforms like Jumia, Amazon, AliExpress, and eBay. 

Your role is to:
1. Ask clarifying questions to understand user needs (budget, preferences, use case)
2. Suggest relevant products based on their requirements
3. Provide product comparisons and recommendations
4. Be conversational, friendly, and helpful
5. Guide users through their shopping journey

When users ask about products:
- Ask about their budget range
- Understand their specific needs and use cases
- Inquire about brand preferences
- Ask about must-have features
- Provide 3-5 relevant product suggestions

Keep responses concise but informative. Use a friendly, conversational tone.`,
      },
    ];

    // Add conversation history (last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    // Get response from GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);

    // Fallback to basic response if API fails
    return 'I apologize, but I\'m having trouble processing your request right now. Could you please try again? I\'m here to help you find the best products!';
  }
};

/**
 * Extract product search intent from user message using AI
 */
export const extractSearchIntent = async (userMessage) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Extract product search information from user messages. Return a JSON object with:
- category: product category (Electronics, Clothing, Books, etc.)
- keywords: array of search keywords
- priceRange: {min, max} if mentioned
- specifications: any specific requirements

Example: "I need a gaming laptop under $1000" 
Returns: {"category": "Electronics", "keywords": ["gaming", "laptop"], "priceRange": {"max": 1000}, "specifications": ["gaming"]}`,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Intent extraction error:', error);
    return {
      keywords: extractKeywordsSimple(userMessage),
      category: null,
    };
  }
};

/**
 * Generate product recommendations based on user preferences and history
 */
export const generateProductRecommendations = async (userMessage, _userHistory) => {
  try {
    const searchIntent = await extractSearchIntent(userMessage);

    // Build search query
    const query = {};

    if (searchIntent.category) {
      query.category = searchIntent.category;
    }

    if (searchIntent.keywords && searchIntent.keywords.length > 0) {
      query.$text = { $search: searchIntent.keywords.join(' ') };
    }

    if (searchIntent.priceRange) {
      query.price = {};
      if (searchIntent.priceRange.min) {
        query.price.$gte = searchIntent.priceRange.min;
      }
      if (searchIntent.priceRange.max) {
        query.price.$lte = searchIntent.priceRange.max;
      }
    }

    // Search for matching products
    const products = await Product.find(query)
      .sort({ rating: -1 })
      .limit(5);

    return {
      products,
      searchIntent,
    };
  } catch (error) {
    console.error('Product recommendation error:', error);

    // Fallback to simple keyword search
    const keywords = extractKeywordsSimple(userMessage);
    const searchRegex = new RegExp(keywords.join('|'), 'i');

    const products = await Product.find({
      $or: [{ name: searchRegex }, { description: searchRegex }],
    })
      .limit(5)
      .sort({ rating: -1 });

    return { products, searchIntent: { keywords } };
  }
};

/**
 * Simple keyword extraction fallback
 */
function extractKeywordsSimple(text) {
  const commonWords = ['i', 'need', 'want', 'looking', 'for', 'a', 'an', 'the', 'is', 'are', 'to', 'buy'];
  const words = text.toLowerCase().split(/\s+/);
  return words.filter((word) => word.length > 3 && !commonWords.includes(word));
}

/**
 * Generate smart product description using AI
 */
export const enhanceProductDescription = async (productName, basicDescription) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a product description expert. Enhance product descriptions to be more engaging, informative, and highlight key features. Keep it under 200 words.',
        },
        {
          role: 'user',
          content: `Product: ${productName}\nBasic Description: ${basicDescription}\n\nCreate an enhanced, engaging product description.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Description enhancement error:', error);
    return basicDescription;
  }
};

export default {
  generateChatResponse,
  extractSearchIntent,
  generateProductRecommendations,
  enhanceProductDescription,
};
