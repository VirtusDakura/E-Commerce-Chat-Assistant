/**
 * Gemini LLM Adapter
 *
 * Implementation of BaseLLM for Google's Gemini AI.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseLLM } from './BaseLLM.js';
import { geminiConfig, getSystemPrompt } from '../../config/llm.js';
import { LLMError } from '../../errors/index.js';

export class GeminiAdapter extends BaseLLM {
  constructor(config = {}) {
    super(config);

    this.provider = 'gemini';
    this.apiKey = config.apiKey || geminiConfig.apiKey;
    this.modelName = config.model || geminiConfig.model;
    this.generationConfig = config.generationConfig || geminiConfig.generationConfig;

    // Initialize the client if API key is available
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  /**
   * Validate Gemini configuration
   * @returns {boolean}
   */
  validateConfig() {
    if (!this.apiKey) {
      console.warn('[GeminiAdapter] GEMINI_API_KEY not configured');
      return false;
    }
    return true;
  }

  /**
   * Process message with Gemini AI
   * @param {string} message - User's message
   * @param {Array} conversationHistory - Previous messages
   * @param {string} systemPromptName - Name of system prompt to use
   * @returns {Promise<Object>} - Structured response
   */
  async processMessage(message, conversationHistory = [], systemPromptName = 'shoppingAssistant') {
    try {
      if (!this.validateConfig()) {
        throw new LLMError('gemini', 'GEMINI_API_KEY not configured');
      }

      const systemPrompt = getSystemPrompt(systemPromptName);

      // Initialize model with system instruction
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt,
        generationConfig: this.generationConfig,
      });

      // Build conversation history for Gemini format
      const history = conversationHistory.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      // Start chat session
      const chat = model.startChat({
        history,
        generationConfig: {
          temperature: this.generationConfig.temperature,
        },
      });

      // Send message
      const result = await chat.sendMessage(message);
      const response = result.response;
      const text = response.text();

      // Parse and validate response
      const parsedResponse = this.parseResponse(text);

      // Clean query if it's a search action
      if (parsedResponse.action === 'search_products' && parsedResponse.query) {
        parsedResponse.query = this.cleanSearchQuery(parsedResponse.query) || parsedResponse.query;
      }

      // Validate response structure
      if (!parsedResponse.action || !parsedResponse.reply) {
        throw new Error('Invalid AI response structure');
      }

      return parsedResponse;
    } catch (error) {
      console.error('[GeminiAdapter] Error:', error.message);

      // Return fallback response
      return this.generateFallbackResponse(message, error);
    }
  }

  /**
   * Generate streaming response (for future implementation)
   * @param {string} message - User's message
   * @param {Array} conversationHistory - Previous messages
   * @param {Function} onChunk - Callback for each chunk
   */
  async processMessageStream(message, conversationHistory = [], onChunk) {
    if (!this.validateConfig()) {
      throw new LLMError('gemini', 'GEMINI_API_KEY not configured');
    }

    const systemPrompt = getSystemPrompt('shoppingAssistant');

    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: systemPrompt,
      generationConfig: this.generationConfig,
    });

    const history = conversationHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(message);

    let fullText = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) {
        onChunk(chunkText);
      }
    }

    return this.parseResponse(fullText);
  }
}

// Export singleton instance with default config
export const geminiAdapter = new GeminiAdapter();

export default GeminiAdapter;
