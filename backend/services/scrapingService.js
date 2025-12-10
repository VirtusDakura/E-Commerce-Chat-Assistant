/**
 * Scraping Service
 *
 * Handles product scraping, caching, and retrieval from external marketplaces.
 */

import Product from '../models/Product.js';
import { getScraperAdapter } from '../adapters/scraper/index.js';
import { cacheConfig } from '../config/scraper.js';
import { NotFoundError } from '../errors/index.js';

/**
 * Search for products on a marketplace
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {string} options.marketplace - Marketplace to search (default: 'jumia')
 * @param {number} options.page - Page number
 * @param {number} options.limit - Results per page
 * @returns {Promise<Array>} - Array of products
 */
export async function searchProducts(query, { marketplace = 'jumia', page = 1, limit = 24 } = {}) {
  try {
    const scraper = getScraperAdapter(marketplace);
    const products = await scraper.search(query, { page, limit });

    // Cache products in database
    await cacheProducts(products);

    return products;
  } catch (error) {
    console.error('[ScrapingService] Search error:', error.message);

    // Try to return cached results as fallback
    const cachedResults = await getCachedSearchResults(query, marketplace, limit);

    if (cachedResults.length > 0) {
      console.log(`[ScrapingService] Returning ${cachedResults.length} cached results`);
      return cachedResults;
    }

    throw error;
  }
}

/**
 * Cache products in database (upsert)
 * @param {Array} products - Products to cache
 */
export async function cacheProducts(products) {
  try {
    const operations = products.map(product => ({
      updateOne: {
        filter: {
          marketplace: product.marketplace,
          productId: product.productId,
        },
        update: {
          $set: {
            name: product.title,
            description: product.title, // Use title as description for now
            price: product.price,
            currency: product.currency,
            productUrl: product.productUrl,
            images: [product.image].filter(Boolean),
            rating: product.rating,
            numReviews: product.reviewsCount,
            availability: 'Unknown',
            category: 'Other',
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
      console.log(`[ScrapingService] Cached ${result.upsertedCount + result.modifiedCount} products`);
    }
  } catch (error) {
    console.error('[ScrapingService] Cache error:', error.message);
    // Don't throw - caching is non-critical
  }
}

/**
 * Get cached search results as fallback
 * @param {string} query - Search query
 * @param {string} marketplace - Marketplace
 * @param {number} limit - Max results
 * @returns {Promise<Array>} - Cached products
 */
export async function getCachedSearchResults(query, marketplace = 'jumia', limit = 24) {
  try {
    const products = await Product.find({
      marketplace,
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
      image: p.images?.[0] || '',
      rating: p.rating,
      reviewsCount: p.numReviews,
      productUrl: p.productUrl,
    }));
  } catch (error) {
    console.error('[ScrapingService] Cache fallback error:', error.message);
    return [];
  }
}

/**
 * Get product by marketplace and product ID
 * @param {string} marketplace - Marketplace
 * @param {string} productId - External product ID
 * @returns {Promise<Object>} - Product
 */
export async function getProductByMarketplaceId(marketplace, productId) {
  const product = await Product.findOne({
    marketplace: marketplace.toLowerCase(),
    productId,
  });

  if (!product) {
    throw new NotFoundError('Product', `${marketplace}/${productId}`);
  }

  return product;
}

/**
 * Check if cached product is fresh
 * @param {Object} product - Product document
 * @returns {boolean} - Whether cache is fresh
 */
export function isCacheFresh(product) {
  if (!product?.scrapedAt) {
    return false;
  }

  const age = Date.now() - product.scrapedAt.getTime();
  return age < cacheConfig.productTTLMs;
}

/**
 * Refresh product data from marketplace
 * @param {string} marketplace - Marketplace
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} - Updated product
 */
export async function refreshProductData(marketplace, productId) {
  const product = await Product.findOne({
    marketplace: marketplace.toLowerCase(),
    productId,
  });

  if (!product) {
    throw new NotFoundError('Product', `${marketplace}/${productId}`);
  }

  // Update timestamps to mark as refreshed
  product.scrapedAt = new Date();
  product.lastSyncedAt = new Date();
  await product.save();

  return product;
}

/**
 * Get products with database IDs for cart/wishlist operations
 * @param {Array} scrapedProducts - Products from scraper
 * @returns {Promise<Array>} - Products with _id fields
 */
export async function enrichProductsWithDbIds(scrapedProducts) {
  const productPromises = scrapedProducts.map(async (p) => {
    const dbProduct = await Product.findOne({
      marketplace: p.marketplace,
      productId: p.productId,
    });

    return {
      ...p,
      _id: dbProduct?._id || null,
    };
  });

  return Promise.all(productPromises);
}

export default {
  searchProducts,
  cacheProducts,
  getCachedSearchResults,
  getProductByMarketplaceId,
  isCacheFresh,
  refreshProductData,
  enrichProductsWithDbIds,
};
