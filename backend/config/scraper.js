/**
 * Scraper Configuration
 *
 * Centralized configuration for web scrapers.
 */

/**
 * Supported marketplaces
 */
export const MARKETPLACES = {
  JUMIA: 'jumia',
  AMAZON: 'amazon', // Future support
  ALIEXPRESS: 'aliexpress', // Future support
  EBAY: 'ebay', // Future support
};

/**
 * Jumia scraper configuration
 */
export const jumiaConfig = {
  baseUrl: process.env.JUMIA_BASE_URL || 'https://www.jumia.com.gh',
  userAgent: process.env.JUMIA_SCRAPER_USER_AGENT ||
    'Mozilla/5.0 (compatible; ECommerceBot/1.0; +http://yoursite.com/bot)',
  throttleMs: parseInt(process.env.SCRAPER_THROTTLE_MS) || 2000,
  timeout: parseInt(process.env.SCRAPER_TIMEOUT_MS) || 15000,
  maxRetries: parseInt(process.env.SCRAPER_MAX_RETRIES) || 3,
  retryDelayMs: parseInt(process.env.SCRAPER_RETRY_DELAY_MS) || 1000,

  /**
   * CSS selectors for Jumia product parsing
   * These can be updated when Jumia changes their HTML structure
   */
  selectors: {
    productContainer: process.env.JUMIA_SELECTOR_CONTAINER || '.prd',
    productName: process.env.JUMIA_SELECTOR_NAME || '.name',
    productPrice: process.env.JUMIA_SELECTOR_PRICE || '.prc',
    productImage: process.env.JUMIA_SELECTOR_IMAGE || 'img.img',
    productLink: process.env.JUMIA_SELECTOR_LINK || 'a.core',
    productRating: process.env.JUMIA_SELECTOR_RATING || '.stars',
    productReviews: process.env.JUMIA_SELECTOR_REVIEWS || '.rev',
  },

  /**
   * Request headers
   */
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  },
};

/**
 * Cache configuration for scraped products
 */
export const cacheConfig = {
  // Time-to-live for cached products (24 hours)
  productTTLMs: parseInt(process.env.PRODUCT_CACHE_TTL_MS) || 24 * 60 * 60 * 1000,

  // Maximum products to cache per search
  maxProductsPerSearch: parseInt(process.env.MAX_PRODUCTS_PER_SEARCH) || 50,
};

/**
 * Get scraper config for a marketplace
 * @param {string} marketplace - Marketplace name
 * @returns {Object} - Scraper configuration
 */
export const getScraperConfig = (marketplace) => {
  switch (marketplace.toLowerCase()) {
  case MARKETPLACES.JUMIA:
    return jumiaConfig;
  default:
    throw new Error(`Unsupported marketplace: ${marketplace}`);
  }
};

export default {
  MARKETPLACES,
  jumiaConfig,
  cacheConfig,
  getScraperConfig,
};
