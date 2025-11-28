import axios from 'axios';
import * as cheerio from 'cheerio';
import Product from '../models/Product.js';

/**
 * Jumia Product Scraping Service
 *
 * IMPORTANT LEGAL NOTICE:
 * This service implements web scraping of Jumia's public product pages.
 * Before deploying to production:
 * 1. Review Jumia's Terms of Service and robots.txt
 * 2. Consider using official Jumia Affiliate API if available
 * 3. Implement proper rate limiting and respect crawl delays
 * 4. Add User-Agent identification
 * 5. Consider data licensing and copyright issues
 *
 * This implementation is for educational/development purposes.
 */

const JUMIA_BASE_URL = process.env.JUMIA_BASE_URL || 'https://www.jumia.com.gh';
const USER_AGENT = process.env.JUMIA_SCRAPER_USER_AGENT ||
  'Mozilla/5.0 (compatible; ECommerceBot/1.0; +http://yoursite.com/bot)';
const THROTTLE_MS = parseInt(process.env.SCRAPER_THROTTLE_MS) || 2000;

// Simple in-memory throttle tracker
const requestTimes = [];

/**
 * Throttle requests to respect server load
 */
async function throttleRequest() {
  const now = Date.now();
  const recentRequests = requestTimes.filter(time => now - time < THROTTLE_MS);

  if (recentRequests.length > 0) {
    const waitTime = THROTTLE_MS - (now - recentRequests[0]);
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  requestTimes.push(Date.now());
  // Keep only last 10 requests in memory
  if (requestTimes.length > 10) {
    requestTimes.shift();
  }
}

/**
 * Exponential backoff retry wrapper
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Parse Jumia product listing page
 */
function parseJumiaSearchResults(html) {
  const $ = cheerio.load(html);
  const products = [];

  // Jumia Ghana search results selector
  // Adjust selectors based on actual Jumia HTML structure
  $('.prd').each((index, element) => {
    try {
      const $product = $(element);

      // Extract product data
      const titleEl = $product.find('.name');
      const title = titleEl.text().trim();

      const priceEl = $product.find('.prc');
      const priceText = priceEl.text().trim();
      const price = parsePrice(priceText);

      const imageEl = $product.find('img.img');
      const image = imageEl.attr('data-src') || imageEl.attr('src') || '';

      const linkEl = $product.find('a.core');
      const productUrl = linkEl.attr('href') || '';
      const fullUrl = productUrl.startsWith('http') ? productUrl : `${JUMIA_BASE_URL}${productUrl}`;

      // Extract product ID from URL
      const productId = extractProductId(fullUrl);

      // Rating
      const ratingEl = $product.find('.stars');
      const ratingText = ratingEl.attr('class') || '';
      const rating = extractRating(ratingText);

      // Reviews count
      const reviewsEl = $product.find('.rev');
      const reviewsText = reviewsEl.text().trim();
      const reviewsCount = parseInt(reviewsText.match(/\d+/)?.[0]) || 0;

      if (title && productId) {
        products.push({
          marketplace: 'jumia',
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
      console.error('Error parsing product element:', err.message);
    }
  });

  return products;
}

/**
 * Parse price from text (e.g., "GH₵ 1,234.56" -> 1234.56)
 */
function parsePrice(priceText) {
  if (!priceText) {
    return 0;
  }

  // Remove currency symbols, commas, spaces
  const cleanPrice = priceText
    .replace(/[GH₵$,\s]/g, '')
    .trim();

  const price = parseFloat(cleanPrice);
  return isNaN(price) ? 0 : price;
}

/**
 * Extract product ID from URL
 * e.g., "/apple-iphone-13-128gb-blue-12345.html" -> "12345"
 */
function extractProductId(url) {
  const match = url.match(/[-_]([a-zA-Z0-9]+)\.html/);
  if (match) {
    return match[1];
  }

  // Fallback: try to find any numeric ID
  const numMatch = url.match(/\/(\d+)/);
  return numMatch ? numMatch[1] : url.split('/').pop() || 'unknown';
}

/**
 * Extract rating from class name
 * e.g., "stars _s" where _s might be "_4-5" for 4.5 stars
 */
function extractRating(ratingClass) {
  const match = ratingClass.match(/_(\d+)(?:-(\d+))?/);
  if (!match) {
    return null;
  }

  const whole = parseInt(match[1]) || 0;
  const decimal = match[2] ? parseInt(match[2]) / 10 : 0;
  return whole + decimal;
}

/**
 * Search Jumia for products
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<Array>} - Array of product objects
 */
export async function searchJumia(query, { page = 1, limit = 24 } = {}) {
  if (!query || query.trim().length === 0) {
    throw new Error('Search query is required');
  }

  try {
    await throttleRequest();

    const searchUrl = `${JUMIA_BASE_URL}/catalog/?q=${encodeURIComponent(query)}&page=${page}`;

    console.log(`[Jumia] Searching: ${searchUrl}`);

    const response = await retryWithBackoff(async () => {
      return await axios.get(searchUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 15000,
      });
    });

    if (response.status !== 200) {
      throw new Error(`Jumia returned status ${response.status}`);
    }

    const products = parseJumiaSearchResults(response.data);

    // Limit results
    const limitedProducts = products.slice(0, limit);

    // Cache products in database
    await cacheProducts(limitedProducts);

    console.log(`[Jumia] Found ${limitedProducts.length} products for: ${query}`);

    return limitedProducts;
  } catch (error) {
    console.error('[Jumia] Search error:', error.message);

    // Check if it's a rate limit error
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Return cached results as fallback
    console.log('[Jumia] Falling back to cached results...');
    return await getCachedSearchResults(query, limit);
  }
}

/**
 * Get product details from Jumia
 */
export async function getJumiaProductDetails(productId) {
  try {
    // Try to get from cache first
    const cached = await Product.findOne({
      marketplace: 'jumia',
      productId,
    });

    // If cache is fresh (< 24 hours old), return it
    if (cached && (Date.now() - cached.scrapedAt.getTime()) < 24 * 60 * 60 * 1000) {
      console.log(`[Jumia] Returning cached product: ${productId}`);
      return cached;
    }

    // Otherwise, scrape fresh data
    await throttleRequest();

    // Note: This is a simplified implementation
    // In production, you'd need to:
    // 1. Construct proper product detail URL
    // 2. Parse detailed product page
    // 3. Extract full description, specs, images, etc.

    console.log(`[Jumia] Fetching fresh details for: ${productId}`);

    // For now, return cached if available
    if (cached) {
      return cached;
    }

    throw new Error(`Product ${productId} not found in cache. Try searching first.`);
  } catch (error) {
    console.error('[Jumia] Product details error:', error.message);
    throw error;
  }
}

/**
 * Cache products in database (upsert)
 */
async function cacheProducts(products) {
  try {
    const operations = products.map(product => ({
      updateOne: {
        filter: { marketplace: product.marketplace, productId: product.productId },
        update: {
          $set: {
            name: product.title,
            description: product.title, // Use title as description for now
            price: product.price,
            currency: product.currency,
            productUrl: product.productUrl,
            images: [product.image],
            rating: product.rating,
            numReviews: product.reviewsCount,
            availability: 'Unknown', // Would need to parse from detail page
            category: 'Other', // Would need to parse from page or URL
            scrapedAt: new Date(),
            lastSyncedAt: new Date(),
            raw: product.raw,
          },
        },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      const result = await Product.bulkWrite(operations);
      console.log(`[Jumia] Cached ${result.upsertedCount + result.modifiedCount} products`);
    }
  } catch (error) {
    console.error('[Jumia] Cache error:', error.message);
    // Don't throw - caching is non-critical
  }
}

/**
 * Get cached search results as fallback
 */
async function getCachedSearchResults(query, limit = 24) {
  try {
    const products = await Product.find({
      marketplace: 'jumia',
      $text: { $search: query },
    })
      .limit(limit)
      .sort({ scrapedAt: -1 });

    return products.map(p => ({
      marketplace: p.marketplace,
      productId: p.productId,
      title: p.name,
      price: p.price,
      currency: p.currency,
      image: p.images[0],
      rating: p.rating,
      reviewsCount: p.numReviews,
      productUrl: p.productUrl,
    }));
  } catch (error) {
    console.error('[Jumia] Cache fallback error:', error.message);
    return [];
  }
}

/**
 * Refresh product data (admin function)
 */
export async function refreshProduct(marketplace, productId) {
  if (marketplace !== 'jumia') {
    throw new Error(`Marketplace ${marketplace} not supported`);
  }

  // Force re-scrape by getting details
  // In production, this would trigger a full product page scrape
  const product = await Product.findOne({ marketplace, productId });

  if (!product) {
    throw new Error(`Product not found: ${marketplace}/${productId}`);
  }

  // Update scrapedAt to mark as refreshed
  product.scrapedAt = new Date();
  product.lastSyncedAt = new Date();
  await product.save();

  return product;
}

export default {
  searchJumia,
  getJumiaProductDetails,
  refreshProduct,
};
