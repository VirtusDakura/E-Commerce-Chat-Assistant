/**
 * Jumia Scraper Adapter
 *
 * Implementation of BaseScraper for Jumia Ghana.
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './BaseScraper.js';
import { jumiaConfig } from '../../config/scraper.js';
import { ScrapingError } from '../../errors/index.js';

export class JumiaScraper extends BaseScraper {
  constructor(config = {}) {
    super({ ...jumiaConfig, ...config });

    this.marketplace = 'jumia';
    this.baseUrl = this.config.baseUrl;
    this.selectors = this.config.selectors;
  }

  /**
   * Build Jumia search URL
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @returns {string} - Full search URL
   */
  buildSearchUrl(query, page = 1) {
    return `${this.baseUrl}/catalog/?q=${encodeURIComponent(query)}&page=${page}`;
  }

  /**
   * Search for products on Jumia
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Array of products
   */
  async search(query, { page = 1, limit = 24 } = {}) {
    if (!query || query.trim().length === 0) {
      throw new ScrapingError('jumia', 'Search query is required');
    }

    try {
      await this.throttleRequest();

      const searchUrl = this.buildSearchUrl(query, page);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[JumiaScraper] Searching: ${searchUrl}`);
      }

      const response = await this.retryWithBackoff(async () => {
        return await axios.get(searchUrl, {
          headers: this.getHeaders(),
          timeout: this.config.timeout,
        });
      }, this.config.maxRetries, this.config.retryDelayMs);

      if (response.status !== 200) {
        throw new ScrapingError('jumia', `Jumia returned status ${response.status}`);
      }

      const products = this.parseSearchResults(response.data);
      const limitedProducts = products.slice(0, limit);

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[JumiaScraper] Found ${limitedProducts.length} products for: ${query}`);
      }

      return limitedProducts;
    } catch (error) {
      console.error('[JumiaScraper] Search error:', error.message);

      if (error.response?.status === 429) {
        throw new ScrapingError('jumia', 'Rate limit exceeded. Please try again later.');
      }

      if (error instanceof ScrapingError) {
        throw error;
      }

      throw new ScrapingError('jumia', error.message);
    }
  }

  /**
   * Parse Jumia search results HTML
   * @param {string} html - HTML content
   * @returns {Array} - Parsed products
   */
  parseSearchResults(html) {
    const $ = cheerio.load(html);
    const products = [];

    $(this.selectors.productContainer).each((_index, element) => {
      try {
        const $product = $(element);

        // Extract product data using configurable selectors
        const titleEl = $product.find(this.selectors.productName);
        const title = titleEl.text().trim();

        const priceEl = $product.find(this.selectors.productPrice);
        const priceText = priceEl.text().trim();
        const price = this.parsePrice(priceText);

        const imageEl = $product.find(this.selectors.productImage);
        const image = imageEl.attr('data-src') || imageEl.attr('src') || '';

        const linkEl = $product.find(this.selectors.productLink);
        const productUrl = linkEl.attr('href') || '';
        const fullUrl = productUrl.startsWith('http') ? productUrl : `${this.baseUrl}${productUrl}`;

        // Extract product ID from URL
        const productId = this.extractProductId(fullUrl);

        // Rating
        const ratingEl = $product.find(this.selectors.productRating);
        const ratingText = ratingEl.attr('class') || '';
        const rating = this.extractRating(ratingText);

        // Reviews count
        const reviewsEl = $product.find(this.selectors.productReviews);
        const reviewsText = reviewsEl.text().trim();
        const reviewsCount = parseInt(reviewsText.match(/\d+/)?.[0]) || 0;

        if (title && productId) {
          products.push({
            marketplace: this.marketplace,
            productId,
            title,
            price,
            currency: 'GHS',
            image,
            rating,
            reviewsCount,
            productUrl: fullUrl,
            raw: {
              priceText,
              ratingText,
              reviewsText,
            },
          });
        }
      } catch (err) {
        console.error('[JumiaScraper] Error parsing product element:', err.message);
      }
    });

    return products;
  }

  /**
   * Extract product ID from URL
   * @param {string} url - Product URL
   * @returns {string} - Product ID
   */
  extractProductId(url) {
    const match = url.match(/[-_]([a-zA-Z0-9]+)\.html/);
    if (match) {
      return match[1];
    }

    const numMatch = url.match(/\/(\d+)/);
    return numMatch ? numMatch[1] : url.split('/').pop() || 'unknown';
  }

  /**
   * Extract rating from class name
   * @param {string} ratingClass - CSS class string
   * @returns {number|null} - Rating value
   */
  extractRating(ratingClass) {
    const match = ratingClass.match(/_(\d+)(?:-(\d+))?/);
    if (!match) {
      return null;
    }

    const whole = parseInt(match[1]) || 0;
    const decimal = match[2] ? parseInt(match[2]) / 10 : 0;
    return whole + decimal;
  }

  /**
   * Get product details (currently returns from cache)
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} - Product details
   */
  async getProductDetails(productId) {
    // For detailed product info, we'd need to:
    // 1. Construct the product URL
    // 2. Scrape the detail page
    // For now, throw an error indicating this needs cache
    throw new ScrapingError(
      'jumia',
      `Product details fetch not implemented. Product ${productId} should be in cache.`,
    );
  }
}

// Export singleton instance
export const jumiaScraper = new JumiaScraper();

export default JumiaScraper;
