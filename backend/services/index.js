/**
 * Services - Re-export from single entry point
 */

export {
  processChat,
  getConversationHistory,
  getUserConversations,
  deleteConversation,
} from './chatService.js';

export {
  searchProducts as searchMarketplace,
  cacheProducts,
  getCachedSearchResults,
  getProductByMarketplaceId,
  isCacheFresh,
  refreshProductData,
  enrichProductsWithDbIds,
} from './scrapingService.js';

export {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  searchProducts,
  compareProducts,
} from './searchService.js';
