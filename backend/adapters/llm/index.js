/**
 * LLM Adapters - Re-export from single entry point
 */

export { BaseLLM } from './BaseLLM.js';
export { GeminiAdapter, geminiAdapter } from './GeminiAdapter.js';

import { GeminiAdapter } from './GeminiAdapter.js';

/**
 * Get LLM adapter by provider name
 * @param {string} provider - Provider name ('gemini', 'openai', etc.)
 * @returns {BaseLLM} - LLM adapter instance
 */
export const getLLMAdapter = (provider = 'gemini') => {
  switch (provider.toLowerCase()) {
  case 'gemini':
    return new GeminiAdapter();
  default:
    throw new Error(`Unsupported LLM provider: ${provider}`);
  }
};
