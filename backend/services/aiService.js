import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini AI Service for E-Commerce Chat Assistant
 *
 * This service processes user messages and determines whether to:
 * 1. Search for products on Jumia
 * 2. Ask clarifying questions
 *
 * Output format is always structured JSON for easy parsing
 */

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System instruction for the AI assistant
const SYSTEM_INSTRUCTION = `You are a helpful shopping assistant for an e-commerce platform that searches Jumia Ghana for products.

Your role:
1. Help users find products they're looking for
2. Ask ONE clarifying question if the user's request is vague
3. When you have enough information, trigger a product search

Response format - You MUST respond with valid JSON only:

When you need more information:
{
  "action": "ask_question",
  "query": null,
  "reply": "Your clarifying question here"
}

When ready to search:
{
  "action": "search_products",
  "query": "specific search keywords for Jumia",
  "reply": "I'm searching Jumia for [product description]..."
}

Guidelines:
- Extract search terms from user messages
- Consider price, brand, category, specifications
- Keep questions brief and friendly
- Use Ghanaian context (prices in GHS)
- Be conversational but concise

Examples:

User: "I need a phone"
Response: {"action": "ask_question", "query": null, "reply": "I'd be happy to help! What's your budget range? And do you prefer any particular brand like iPhone, Samsung, or Tecno?"}

User: "iPhone 13 under 4000 GHS"
Response: {"action": "search_products", "query": "iPhone 13", "reply": "Let me search for iPhone 13 models on Jumia for you..."}

User: "laptop for coding"
Response: {"action": "ask_question", "query": null, "reply": "Great! What's your budget for the laptop? Also, do you prefer Windows or Mac?"}

User: "gaming laptop under 6000 GHS"
Response: {"action": "search_products", "query": "gaming laptop", "reply": "Searching for gaming laptops on Jumia within your budget..."}

IMPORTANT: Always respond with ONLY valid JSON. No markdown, no extra text.`;

/**
 * Process user message and return structured response
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages [{role, content}]
 * @returns {Promise<Object>} - { action, query, reply }
 */
export async function processMessage(message, conversationHistory = []) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Initialize model with system instruction
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    });

    // Build conversation history
    const history = conversationHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Start chat session
    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
      },
    });

    // Send message
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    const parsedResponse = parseAIResponse(text);

    // Validate response structure
    if (!parsedResponse.action || !parsedResponse.reply) {
      throw new Error('Invalid AI response structure');
    }

    return parsedResponse;
  } catch (error) {
    console.error('[Gemini AI] Error:', error.message);

    // Fallback response
    return generateFallbackResponse(message, error);
  }
}

/**
 * Parse AI response, handling various JSON formats
 */
function parseAIResponse(text) {
  try {
    // Remove markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\n?/g, '');
    }

    // Try to parse JSON
    const parsed = JSON.parse(cleanText);

    // Ensure required fields
    return {
      action: parsed.action || 'ask_question',
      query: parsed.query || null,
      reply: parsed.reply || parsed.message || 'How can I help you find products on Jumia?',
    };
  } catch {
    // If parsing fails, try to extract JSON using regex
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // Fall through to fallback
      }
    }

    // Fallback: treat entire response as reply
    return {
      action: 'ask_question',
      query: null,
      reply: text.trim() || 'How can I help you find products on Jumia?',
    };
  }
}

/**
 * Generate fallback response when AI fails
 */
function generateFallbackResponse(message, error) {
  console.error('[AI Fallback] Using rule-based response due to:', error.message);

  const lowerMessage = message.toLowerCase();

  // Check if message contains shopping intent
  const shoppingKeywords = [
    'buy', 'purchase', 'need', 'want', 'looking for', 'search',
    'find', 'get', 'shop', 'price', 'how much',
  ];

  const hasShoppingIntent = shoppingKeywords.some((keyword) =>
    lowerMessage.includes(keyword),
  );

  // Check for product categories
  const productKeywords = [
    'phone', 'laptop', 'computer', 'tv', 'watch', 'shoe', 'cloth',
    'bag', 'headphone', 'speaker', 'tablet', 'camera', 'book',
  ];

  const hasProductMention = productKeywords.some((keyword) =>
    lowerMessage.includes(keyword),
  );

  // Check if message has enough detail to search
  const hasEnoughDetail = message.split(' ').length >= 3 && (
    hasProductMention ||
    /\d+/.test(message) // Contains numbers (might be price/model)
  );

  if (hasShoppingIntent && hasEnoughDetail) {
    return {
      action: 'search_products',
      query: message,
      reply: `Let me search Jumia for "${message}"...`,
    };
  }

  // Ask clarifying question
  if (hasShoppingIntent || hasProductMention) {
    return {
      action: 'ask_question',
      query: null,
      reply: 'I\'d love to help you find that! Could you tell me more details like your budget or preferred brand?',
    };
  }

  // Generic greeting/help
  return {
    action: 'ask_question',
    query: null,
    reply: 'Hello! I can help you find products on Jumia Ghana. What are you looking for today?',
  };
}

/**
 * Extract search intent from message (backup for simple cases)
 */
export function extractSearchKeywords(message) {
  // Remove common words
  const stopWords = [
    'i', 'want', 'need', 'looking', 'for', 'a', 'an', 'the', 'to', 'buy',
    'purchase', 'get', 'find', 'search', 'me', 'can', 'you', 'help',
  ];

  const words = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.includes(word));

  return words.join(' ');
}

/**
 * Validate Gemini API key configuration
 */
export function validateConfig() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[Gemini AI] WARNING: GEMINI_API_KEY not configured');
    return false;
  }
  return true;
}

export default {
  processMessage,
  extractSearchKeywords,
  validateConfig,
};
