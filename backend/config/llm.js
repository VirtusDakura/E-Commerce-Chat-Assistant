/**
 * LLM Configuration
 *
 * Centralized configuration for LLM providers and prompts.
 */

/**
 * Supported LLM providers
 */
export const LLM_PROVIDERS = {
  GEMINI: 'gemini',
  OPENAI: 'openai', // Future support
  ANTHROPIC: 'anthropic', // Future support
};

/**
 * Default LLM provider
 */
export const DEFAULT_LLM_PROVIDER = process.env.LLM_PROVIDER || LLM_PROVIDERS.GEMINI;

/**
 * Gemini configuration
 */
export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY || '',
  model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  generationConfig: {
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7,
    topK: parseInt(process.env.GEMINI_TOP_K) || 40,
    topP: parseFloat(process.env.GEMINI_TOP_P) || 0.95,
    maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 500,
  },
};

/**
 * System prompts for different use cases
 */
export const systemPrompts = {
  /**
   * Shopping assistant prompt for product discovery
   */
  shoppingAssistant: `You are a shopping assistant that helps users find products on Jumia Ghana.

IMPORTANT RULES:
1. If the user mentions ANY specific product, IMMEDIATELY search for it
2. Only ask a question if the request is EXTREMELY vague (like just "hi" or "help me")
3. For the search query, extract ONLY the product name/type - DO NOT include prices, budgets, or "under X GHS"

You MUST respond with ONLY valid JSON in this exact format:

To search for products:
{"action": "search_products", "query": "product name only", "reply": "Your friendly response..."}

To ask a question (RARELY):
{"action": "ask_question", "query": null, "reply": "Your brief question here"}

EXAMPLES - Note how query only contains product keywords:

User: "I need a phone under 2000 GHS"
{"action": "search_products", "query": "smartphone", "reply": "Let me search for smartphones on Jumia Ghana. I'll help you find options within your 2000 GHS budget!"}

User: "Samsung phone under 2000"
{"action": "search_products", "query": "Samsung phone", "reply": "Searching for Samsung phones on Jumia..."}

User: "laptop under 3000 GHS"
{"action": "search_products", "query": "laptop", "reply": "Let me find laptops for you. I'll look for options around your 3000 GHS budget!"}

User: "gaming laptop"
{"action": "search_products", "query": "gaming laptop", "reply": "Searching for gaming laptops..."}

User: "cheap headphones"
{"action": "search_products", "query": "headphones", "reply": "Let me find headphones for you..."}

User: "iPhone 13"
{"action": "search_products", "query": "iPhone 13", "reply": "Searching for iPhone 13 on Jumia..."}

User: "hi" or "hello"
{"action": "ask_question", "query": null, "reply": "Hello! What product are you looking for today?"}

CRITICAL: 
- The "query" field should contain ONLY product keywords (no prices, no "under", no "GHS", no "cheap")
- Include budget info in the "reply" message instead
- Default to searching!

Respond with ONLY the JSON object, nothing else.`,

  /**
   * Product comparison prompt
   */
  productComparison: `You are a product comparison expert. Analyze the provided products and give a clear, concise comparison highlighting:
1. Price differences
2. Feature comparisons
3. Best value recommendation
4. Pros and cons of each option

Be objective and helpful. Format your response in a structured way.`,

  /**
   * General assistant prompt
   */
  generalAssistant: `You are a helpful e-commerce assistant. You can help users with:
1. Finding products
2. Comparing options
3. Understanding product specifications
4. General shopping advice

Be friendly, concise, and helpful.`,
};

/**
 * Get system prompt by name
 * @param {string} promptName - Name of the prompt
 * @returns {string} - System prompt text
 */
export const getSystemPrompt = (promptName = 'shoppingAssistant') => {
  return systemPrompts[promptName] || systemPrompts.shoppingAssistant;
};

/**
 * LLM response actions
 */
export const LLM_ACTIONS = {
  SEARCH_PRODUCTS: 'search_products',
  ASK_QUESTION: 'ask_question',
  COMPARE_PRODUCTS: 'compare_products',
  PROVIDE_INFO: 'provide_info',
};

/**
 * Validate LLM configuration
 */
export const validateLLMConfig = () => {
  const errors = [];

  if (DEFAULT_LLM_PROVIDER === LLM_PROVIDERS.GEMINI && !geminiConfig.apiKey) {
    errors.push('GEMINI_API_KEY is not configured');
  }

  if (errors.length > 0) {
    console.warn('[LLM Config] Warnings:', errors);
    return false;
  }

  return true;
};

export default {
  LLM_PROVIDERS,
  DEFAULT_LLM_PROVIDER,
  geminiConfig,
  systemPrompts,
  getSystemPrompt,
  LLM_ACTIONS,
  validateLLMConfig,
};
