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
      .limit(limit)
      .populate('createdBy', 'name email');

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
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('reviews.user', 'name');

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

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      images,
      brand,
      featured,
    } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, and category',
      });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one product image',
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      images,
      brand,
      featured: featured || false,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product',
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product',
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete product error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product',
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
      .sort('-createdAt')
      .populate('createdBy', 'name email');

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

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating and comment',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    // Add review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    // Update rating and numReviews
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: product,
    });
  } catch (error) {
    console.error('Create review error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error creating review',
    });
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('reviews rating numReviews')
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      count: product.reviews.length,
      rating: product.rating,
      data: product.reviews,
    });
  } catch (error) {
    console.error('Get reviews error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reviews',
    });
  }
};

// @desc    Delete product review
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user owns the review or is admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    // Remove review
    product.reviews.pull(reviewId);

    // Recalculate rating and numReviews
    product.numReviews = product.reviews.length;
    if (product.reviews.length > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: product,
    });
  } catch (error) {
    console.error('Delete review error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting review',
    });
  }
};
