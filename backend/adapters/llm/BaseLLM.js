/**
 * Base LLM Adapter Interface
 *
 * Abstract base class for LLM provider adapters.
 * All LLM adapters must implement this interface.
 */

/**
 * @typedef {Object} LLMResponse
 * @property {string} action - Action to take (search_products, ask_question, etc.)
 * @property {string|null} query - Search query if action is search_products
 * @property {string} reply - Response text to show user
 */

/**
 * @typedef {Object} ConversationMessage
 * @property {string} role - 'user' or 'assistant'
 * @property {string} content - Message content
 */

export class BaseLLM {
  constructor(config = {}) {
    if (new.target === BaseLLM) {
      throw new Error('BaseLLM is an abstract class and cannot be instantiated directly');
    }

    this.config = config;
    this.provider = 'base';
  }

  /**
   * Process a message and return structured response
   * @param {string} message - User's message
   * @param {ConversationMessage[]} conversationHistory - Previous messages
   * @param {string} systemPrompt - System instruction
   * @returns {Promise<LLMResponse>} - Structured response
   */
  async processMessage(_message, _conversationHistory = [], _systemPrompt = '') {
    throw new Error('processMessage must be implemented by subclass');
  }

  /**
   * Validate the adapter configuration
   * @returns {boolean} - Whether configuration is valid
   */
  validateConfig() {
    throw new Error('validateConfig must be implemented by subclass');
  }

  /**
   * Get the provider name
   * @returns {string} - Provider name
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Parse AI response text into structured format
   * @param {string} text - Raw response text
   * @returns {LLMResponse} - Parsed response
   */
  parseResponse(text) {
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

      return {
        action: parsed.action || 'ask_question',
        query: parsed.query || null,
        reply: parsed.reply || parsed.message || 'How can I help you?',
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
        reply: text.trim() || 'How can I help you?',
      };
    }
  }

  /**
   * Clean search query to remove price/budget information and filler words
   * @param {string} query - Raw query
   * @returns {string|null} - Cleaned query
   */
  cleanSearchQuery(query) {
    if (!query) {
      return null;
    }

    const cleaned = query
      // Remove common filler phrases (be careful not to eat product words)
      .replace(/^(i need help finding|find me|i am looking for|looking for|i want|i need|can you find|show me|get me|help me find|search for)\s+(a|an|some|the)\s+/gi, '')
      .replace(/^(i need help finding|find me|i am looking for|looking for|i want|i need|can you find|show me|get me|help me find|search for)\s+/gi, '')
      .replace(/^(hello|hi|hey|please|thanks|thank you|okay|ok|sure)[,.\s]+/gi, '')
      // Remove price patterns
      .replace(/\b(under|below|less than|up to|within|around|about|max|maximum)\s*\d+[\d,]*\s*(ghs|cedis|gh₵|₵|naira|ngn|₦)?/gi, '')
      .replace(/\d+[\d,]*\s*(ghs|cedis|gh₵|₵|naira|ngn|₦)\s*(budget|or less|or below|max|maximum)?/gi, '')
      .replace(/\b(budget|price range|price limit|affordable|cheap|expensive)\b[:\s]*/gi, '')
      .replace(/\b\d+[\d,]*\s*(ghs|cedis|gh₵|₵|naira|ngn|₦)\b/gi, '')
      .replace(/\b(best|good|great|top|quality|nice|premium|latest|new|popular)\s+/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned || cleaned.length < 2) {
      return null;
    }

    return cleaned;
  }

  /**
   * Generate fallback response when AI fails
   * @param {string} message - Original user message
   * @param {Error} error - Error that occurred
   * @returns {LLMResponse} - Fallback response
   */
  generateFallbackResponse(message, error) {
    console.error(`[${this.provider}] Fallback response due to:`, error.message);

    const lowerMessage = message.toLowerCase();

    // Check for product keywords
    const productKeywords = [
      'phone', 'laptop', 'computer', 'tv', 'television', 'watch', 'shoe', 'cloth',
      'bag', 'headphone', 'earphone', 'speaker', 'tablet', 'camera', 'book',
      'fridge', 'refrigerator', 'washing', 'microwave', 'blender', 'fan',
      'air conditioner', 'ac', 'printer', 'monitor', 'keyboard', 'mouse',
      'charger', 'cable', 'case', 'cover', 'screen', 'battery', 'samsung',
      'iphone', 'tecno', 'infinix', 'redmi', 'xiaomi', 'hp', 'dell', 'lenovo',
      'asus', 'acer', 'apple', 'macbook', 'playstation', 'xbox', 'nintendo',
      'gaming', 'wireless', 'bluetooth', 'smart', 'android', 'ios',
    ];

    const foundProduct = productKeywords.find((keyword) =>
      lowerMessage.includes(keyword),
    );

    if (foundProduct) {
      // Clean the search query to extract just product keywords
      const cleanedQuery = this.cleanSearchQuery(message) || foundProduct;
      return {
        action: 'search_products',
        query: cleanedQuery,
        reply: `Let me search for "${cleanedQuery}"...`,
      };
    }

    // Check for shopping intent
    const shoppingKeywords = [
      'buy', 'purchase', 'need', 'want', 'looking for', 'search',
      'find', 'get', 'shop', 'price', 'how much', 'cost',
    ];

    const hasShoppingIntent = shoppingKeywords.some((keyword) =>
      lowerMessage.includes(keyword),
    );

    if (hasShoppingIntent && message.split(' ').length >= 2) {
      // Clean the search query
      const cleanedQuery = this.cleanSearchQuery(message) || message;
      return {
        action: 'search_products',
        query: cleanedQuery,
        reply: `Let me search for "${cleanedQuery}"...`,
      };
    }

    return {
      action: 'ask_question',
      query: null,
      reply: 'Hello! What product are you looking for today?',
    };
  }
}

export default BaseLLM;
