import Product from '../models/Product.js';
import { searchProducts as searchMarketplaceProducts, refreshProductData as refreshMarketplaceProduct } from '../services/scrapingService.js';

// @desc    Get all products with filtering, sorting, pagination, and search
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'search'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Advanced filtering (price[gte]=100, price[lte]=500)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const filterQuery = JSON.parse(queryStr);

    // Search functionality
    if (req.query.search) {
      filterQuery.$text = { $search: req.query.search };
    }

    // Build query
    let query = Product.find(filterQuery);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default: newest first
    }

    // Execute query with pagination
    const products = await query
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Product.countDocuments(filterQuery);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products',
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product by ID error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product',
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true })
      .limit(10)
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching featured products',
    });
  }
};

// @desc    Advanced product search with multiple filters
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filterQuery = {};

    // Text search
    if (req.query.q) {
      filterQuery.$text = { $search: req.query.q };
    }

    // Category filter
    if (req.query.category) {
      filterQuery.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filterQuery.price = {};
      if (req.query.minPrice) {
        filterQuery.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filterQuery.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Rating filter (minimum rating)
    if (req.query.minRating) {
      filterQuery.rating = { $gte: parseFloat(req.query.minRating) };
    }

    // Stock availability filter
    if (req.query.inStock === 'true') {
      filterQuery.stock = { $gt: 0 };
    }

    // Brand filter
    if (req.query.brand) {
      filterQuery.brand = req.query.brand;
    }

    // Build query
    let query = Product.find(filterQuery);

    // Sorting
    const sortOptions = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'rating-desc': { rating: -1 },
      'newest': { createdAt: -1 },
      'name-asc': { name: 1 },
      'name-desc': { name: -1 },
    };

    const sortBy = req.query.sort || 'newest';
    if (sortOptions[sortBy]) {
      query = query.sort(sortOptions[sortBy]);
    }

    // Execute query with pagination
    const products = await query.skip(skip).limit(limit);

    // Get total count for pagination
    const total = await Product.countDocuments(filterQuery);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      filters: {
        query: req.query.q,
        category: req.query.category,
        priceRange: {
          min: req.query.minPrice,
          max: req.query.maxPrice,
        },
        minRating: req.query.minRating,
        inStock: req.query.inStock,
        brand: req.query.brand,
        sort: sortBy,
      },
      data: products,
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error searching products',
    });
  }
};

// @desc    Compare multiple products
// @route   POST /api/products/compare
// @access  Public
export const compareProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 product IDs to compare',
      });
    }

    if (productIds.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Cannot compare more than 5 products at once',
      });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more products not found',
      });
    }

    // Build comparison matrix
    const comparison = {
      products: products.map((p) => ({
        id: p._id,
        name: p.name,
        price: p.price,
        platform: p.platform,
        rating: p.rating,
        numReviews: p.numReviews,
        availability: p.availability,
        brand: p.brand,
        externalUrl: p.externalUrl,
        images: p.images,
      })),
      priceComparison: {
        lowest: Math.min(...products.map((p) => p.price)),
        highest: Math.max(...products.map((p) => p.price)),
        average: products.reduce((sum, p) => sum + p.price, 0) / products.length,
      },
      ratingComparison: {
        highest: Math.max(...products.map((p) => p.rating)),
        average: products.reduce((sum, p) => sum + p.rating, 0) / products.length,
      },
      platformDistribution: products.reduce((acc, p) => {
        acc[p.platform] = (acc[p.platform] || 0) + 1;
        return acc;
      }, {}),
      bestValue: products.reduce((best, current) => {
        const currentScore = current.rating / (current.price / 100);
        const bestScore = best.rating / (best.price / 100);
        return currentScore > bestScore ? current : best;
      }),
    };

    res.status(200).json({
      success: true,
      count: products.length,
      data: comparison,
    });
  } catch (error) {
    console.error('Compare products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error comparing products',
    });
  }
};

// @desc    Search Jumia products
// @route   GET /api/products/jumia/search
// @access  Public
export const searchJumiaProducts = async (req, res) => {
  try {
    const { q: query, page, limit } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query (q) is required',
      });
    }

    const products = await searchMarketplaceProducts(query, {
      marketplace: 'jumia',
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 24,
    });

    const total = products.length;

    res.status(200).json({
      success: true,
      data: products,
      total,
      page: parseInt(page) || 1,
      marketplace: 'jumia',
    });
  } catch (error) {
    console.error('Jumia search error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error searching Jumia products',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get product by marketplace and productId
// @route   GET /api/products/:marketplace/:productId
// @access  Public
export const getProductByMarketplaceId = async (req, res) => {
  try {
    const { marketplace, productId } = req.params;

    const product = await Product.findOne({
      marketplace: marketplace.toLowerCase(),
      productId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${marketplace}/${productId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product by marketplace ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product',
    });
  }
};

// @desc    Refresh product data from external source
// @route   POST /api/products/refresh/:marketplace/:productId
// @access  Private/Admin
export const refreshProductData = async (req, res) => {
  try {
    const { marketplace, productId } = req.params;

    if (marketplace.toLowerCase() !== 'jumia') {
      return res.status(400).json({
        success: false,
        message: `Marketplace ${marketplace} refresh not supported yet`,
      });
    }

    const product = await refreshMarketplaceProduct(marketplace.toLowerCase(), productId);

    res.status(200).json({
      success: true,
      message: 'Product data refreshed successfully',
      data: product,
    });
  } catch (error) {
    console.error('Refresh product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error refreshing product',
    });
  }
};

// @desc    Redirect to external product URL and track click
// @route   GET /api/products/redirect/:marketplace/:productId
// @access  Public
export const redirectToProduct = async (req, res) => {
  try {
    const { marketplace, productId } = req.params;

    const product = await Product.findOne({
      marketplace: marketplace.toLowerCase(),
      productId,
    });

    if (!product || !product.productUrl) {
      return res.status(404).json({
        success: false,
        message: 'Product URL not found',
      });
    }

    // TODO: Log click event for analytics
    console.log(`[Analytics] Product click: ${marketplace}/${productId} by user ${req.user?.id || 'anonymous'}`);

    // Redirect to external marketplace
    res.redirect(302, product.productUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({
      success: false,
      message: 'Error redirecting to product',
    });
  }
};
