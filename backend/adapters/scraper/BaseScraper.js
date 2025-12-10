/**
 * Base Scraper Interface
 *
 * Abstract base class for marketplace scrapers.
 * All scraper adapters must implement this interface.
 */

/**
 * @typedef {Object} ScrapedProduct
 * @property {string} marketplace - Source marketplace
 * @property {string} productId - External product ID
 * @property {string} title - Product title
 * @property {number} price - Product price
 * @property {string} currency - Currency code
 * @property {string} image - Main image URL
 * @property {number|null} rating - Product rating
 * @property {number} reviewsCount - Number of reviews
 * @property {string} productUrl - Full product URL
 * @property {Object} raw - Raw scraped data
 */

export class BaseScraper {
  constructor(config = {}) {
    if (new.target === BaseScraper) {
      throw new Error('BaseScraper is an abstract class and cannot be instantiated directly');
    }

    this.config = config;
    this.marketplace = 'base';
    this.requestTimes = [];
  }

  /**
   * Search for products
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Results per page
   * @returns {Promise<ScrapedProduct[]>} - Array of products
   */
  async search(_query, _options = {}) {
    throw new Error('search must be implemented by subclass');
  }

  /**
   * Get product details by ID
   * @param {string} productId - Product ID
   * @returns {Promise<ScrapedProduct>} - Product details
   */
  async getProductDetails(_productId) {
    throw new Error('getProductDetails must be implemented by subclass');
  }

  /**
   * Build search URL
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @returns {string} - Full search URL
   */
  buildSearchUrl(_query, _page = 1) {
    throw new Error('buildSearchUrl must be implemented by subclass');
  }

  /**
   * Parse HTML response into products
   * @param {string} html - HTML content
   * @returns {ScrapedProduct[]} - Parsed products
   */
  parseSearchResults(_html) {
    throw new Error('parseSearchResults must be implemented by subclass');
  }

  /**
   * Throttle requests to respect server load
   */
  async throttleRequest() {
    const throttleMs = this.config.throttleMs || 2000;
    const now = Date.now();
    const recentRequests = this.requestTimes.filter(time => now - time < throttleMs);

    if (recentRequests.length > 0) {
      const waitTime = throttleMs - (now - recentRequests[0]);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    this.requestTimes.push(Date.now());
    // Keep only last 10 requests in memory
    if (this.requestTimes.length > 10) {
      this.requestTimes.shift();
    }
  }

  /**
   * Retry with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum retry attempts
   * @param {number} baseDelay - Base delay in ms
   * @returns {Promise<any>} - Function result
   */
  async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, i);
        console.log(`[${this.marketplace}] Retry attempt ${i + 1} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Get marketplace name
   * @returns {string}
   */
  getMarketplace() {
    return this.marketplace;
  }

  /**
   * Parse price from text
   * @param {string} priceText - Price text
   * @returns {number} - Parsed price
   */
  parsePrice(priceText) {
    if (!priceText) {
      return 0;
    }

    const cleanPrice = priceText
      .replace(/[GH₵$€£,\s]/g, '')
      .trim();

    const price = parseFloat(cleanPrice);
    return isNaN(price) ? 0 : price;
  }

  /**
   * Get default HTTP headers
   * @returns {Object} - Headers object
   */
  getHeaders() {
    return {
      'User-Agent': this.config.userAgent ||
        'Mozilla/5.0 (compatible; ECommerceBot/1.0)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      ...this.config.headers,
    };
  }
}

export default BaseScraper;
