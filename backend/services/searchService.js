/**
 * Search Service
 *
 * Handles product search operations (database and external).
 */

import Product from '../models/Product.js';
import { NotFoundError } from '../errors/index.js';

/**
 * Get all products with filtering, sorting, and pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Paginated products
 */
export async function getAllProducts({
  page = 1,
  limit = 10,
  sort = '-createdAt',
  search,
  filters = {},
} = {}) {
  const skip = (page - 1) * limit;

  // Build filter query
  const filterQuery = { ...filters };

  // Text search
  if (search) {
    filterQuery.$text = { $search: search };
  }

  // Build query
  let query = Product.find(filterQuery);

  // Sorting
  const sortBy = sort.split(',').join(' ');
  query = query.sort(sortBy);

  // Execute query with pagination
  const products = await query.skip(skip).limit(limit);
  const total = await Product.countDocuments(filterQuery);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get product by ID
 * @param {string} id - Product MongoDB ID
 * @returns {Promise<Object>} - Product document
 */
export async function getProductById(id) {
  const product = await Product.findById(id);

  if (!product) {
    throw new NotFoundError('Product', id);
  }

  return product;
}

/**
 * Get featured products
 * @param {number} limit - Max results
 * @returns {Promise<Array>} - Featured products
 */
export async function getFeaturedProducts(limit = 10) {
  return Product.find({ featured: true })
    .limit(limit)
    .sort('-createdAt');
}

/**
 * Advanced product search
 * @param {Object} options - Search options
 * @returns {Promise<Object>} - Search results
 */
export async function searchProducts({
  q,
  category,
  minPrice,
  maxPrice,
  minRating,
  inStock,
  brand,
  sort = 'newest',
  page = 1,
  limit = 10,
} = {}) {
  const skip = (page - 1) * limit;
  const filterQuery = {};

  // Text search
  if (q) {
    filterQuery.$text = { $search: q };
  }

  // Category filter
  if (category) {
    filterQuery.category = category;
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    filterQuery.price = {};
    if (minPrice !== undefined) {
      filterQuery.price.$gte = minPrice;
    }
    if (maxPrice !== undefined) {
      filterQuery.price.$lte = maxPrice;
    }
  }

  // Rating filter
  if (minRating !== undefined) {
    filterQuery.rating = { $gte: minRating };
  }

  // Stock availability
  if (inStock === 'true' || inStock === true) {
    filterQuery.availability = 'In Stock';
  }

  // Brand filter
  if (brand) {
    filterQuery.brand = brand;
  }

  // Sorting options
  const sortOptions = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'rating-desc': { rating: -1 },
    newest: { createdAt: -1 },
    'name-asc': { name: 1 },
    'name-desc': { name: -1 },
  };

  const sortBy = sortOptions[sort] || sortOptions.newest;

  // Execute query
  const products = await Product.find(filterQuery)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filterQuery);

  return {
    products,
    filters: {
      query: q,
      category,
      priceRange: { min: minPrice, max: maxPrice },
      minRating,
      inStock,
      brand,
      sort,
    },
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Compare multiple products
 * @param {Array<string>} productIds - Product IDs to compare
 * @returns {Promise<Object>} - Comparison data
 */
export async function compareProducts(productIds) {
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new NotFoundError('Products', 'One or more products not found');
  }

  return {
    products: products.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      marketplace: p.marketplace,
      rating: p.rating,
      numReviews: p.numReviews,
      availability: p.availability,
      brand: p.brand,
      productUrl: p.productUrl,
      images: p.images,
    })),
    priceComparison: {
      lowest: Math.min(...products.map((p) => p.price)),
      highest: Math.max(...products.map((p) => p.price)),
      average: products.reduce((sum, p) => sum + p.price, 0) / products.length,
    },
    ratingComparison: {
      highest: Math.max(...products.map((p) => p.rating || 0)),
      average: products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length,
    },
    platformDistribution: products.reduce((acc, p) => {
      acc[p.marketplace] = (acc[p.marketplace] || 0) + 1;
      return acc;
    }, {}),
    bestValue: products.reduce((best, current) => {
      const currentScore = (current.rating || 0) / (current.price / 100);
      const bestScore = (best.rating || 0) / (best.price / 100);
      return currentScore > bestScore ? current : best;
    }),
  };
}

export default {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  searchProducts,
  compareProducts,
};
