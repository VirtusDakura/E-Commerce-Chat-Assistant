import Product from '../models/Product.js';

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
