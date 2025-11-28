import axios from 'axios';
import * as cheerio from 'cheerio';
import Product from '../models/Product.js';

/**
 * Scrape products from Jumia
 * Note: In production, use official APIs when available
 */
export const scrapeJumiaProducts = async (searchQuery) => {
  try {
    // This is a placeholder - you'll need to implement actual scraping logic
    // or use Jumia's API if available
    const url = `https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(searchQuery)}`;

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const products = [];

    // Example scraping logic (adjust selectors based on actual Jumia structure)
    $('.prd').each((i, element) => {
      if (i >= 10) {
        return false;
      } // Limit to 10 products

      const name = $(element).find('.name').text().trim();
      const price = $(element).find('.prc').text().trim();
      const image = $(element).find('img').attr('data-src') || $(element).find('img').attr('src');
      const productUrl = $(element).find('a').attr('href');

      if (name && price) {
        products.push({
          name,
          price: parsePrice(price),
          images: [image],
          platform: 'Jumia',
          externalUrl: productUrl.startsWith('http') ? productUrl : `https://www.jumia.com.ng${productUrl}`,
          externalProductId: extractProductId(productUrl),
        });
      }
    });

    return products;
  } catch (error) {
    console.error('Jumia scraping error:', error.message);
    return [];
  }
};

/**
 * Fetch products from Amazon Product Advertising API
 * Requires Amazon PA-API credentials
 */
export const fetchAmazonProducts = async (searchQuery) => {
  try {
    // Placeholder for Amazon PA-API integration
    // You need to sign up for Amazon Associates and get API credentials
    // Use official amazon-paapi library

    console.log('Amazon API integration pending - requires PA-API credentials');
    console.log('Search query:', searchQuery);

    // Mock data for now
    return [];
  } catch (error) {
    console.error('Amazon API error:', error.message);
    return [];
  }
};

/**
 * Aggregate products from multiple platforms
 */
export const searchMultiplePlatforms = async (searchQuery, options = {}) => {
  try {
    const { platforms = ['Jumia', 'Amazon'], maxResults = 20 } = options;

    const searchPromises = [];

    if (platforms.includes('Jumia')) {
      searchPromises.push(scrapeJumiaProducts(searchQuery));
    }

    if (platforms.includes('Amazon')) {
      searchPromises.push(fetchAmazonProducts(searchQuery));
    }

    const results = await Promise.allSettled(searchPromises);

    // Combine all successful results
    const allProducts = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value)
      .slice(0, maxResults);

    return allProducts;
  } catch (error) {
    console.error('Multi-platform search error:', error);
    return [];
  }
};

/**
 * Update or create products in database from scraped data
 */
export const syncProducts = async (scrapedProducts, category) => {
  try {
    const syncedProducts = [];

    for (const productData of scrapedProducts) {
      // Check if product already exists
      let product = await Product.findOne({
        externalProductId: productData.externalProductId,
        platform: productData.platform,
      });

      if (product) {
        // Update existing product
        product.price = productData.price;
        product.availability = productData.availability || 'Unknown';
        product.lastSyncedAt = new Date();
        await product.save();
      } else {
        // Create new product
        product = await Product.create({
          name: productData.name,
          description: productData.description || 'Product details coming soon',
          price: productData.price,
          category: category || 'Other',
          platform: productData.platform,
          externalUrl: productData.externalUrl,
          externalProductId: productData.externalProductId,
          images: productData.images || [],
          availability: productData.availability || 'Unknown',
          brand: productData.brand || '',
          lastSyncedAt: new Date(),
        });
      }

      syncedProducts.push(product);
    }

    return syncedProducts;
  } catch (error) {
    console.error('Product sync error:', error);
    throw error;
  }
};

/**
 * Scheduled job to refresh product data
 */
export const refreshProductPrices = async () => {
  try {
    // Get products that haven't been updated in the last 6 hours
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

    const outdatedProducts = await Product.find({
      lastSyncedAt: { $lt: sixHoursAgo },
    }).limit(50); // Process 50 products at a time

    console.log(`Refreshing ${outdatedProducts.length} products...`);

    // Group by platform
    const byPlatform = outdatedProducts.reduce((acc, product) => {
      if (!acc[product.platform]) {
        acc[product.platform] = [];
      }
      acc[product.platform].push(product);
      return {};
    }, {});

    // Refresh each platform (implement actual refresh logic)
    for (const [platform, products] of Object.entries(byPlatform)) {
      console.log(`Refreshing ${products.length} products from ${platform}`);
      // Implement platform-specific refresh logic
    }

    return { refreshed: outdatedProducts.length };
  } catch (error) {
    console.error('Price refresh error:', error);
    return { error: error.message };
  }
};

// Helper functions
function parsePrice(priceString) {
  // Extract numeric value from price string
  const match = priceString.match(/[\d,]+\.?\d*/);
  if (match) {
    return parseFloat(match[0].replace(/,/g, ''));
  }
  return 0;
}

function extractProductId(url) {
  // Extract product ID from URL
  const match = url.match(/\/(\d+)\//);
  return match ? match[1] : url.split('/').pop();
}

export default {
  scrapeJumiaProducts,
  fetchAmazonProducts,
  searchMultiplePlatforms,
  syncProducts,
  refreshProductPrices,
};
