import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Core product information
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
      index: 'text',
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      index: 'text',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'GHS',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports',
        'Toys',
        'Beauty',
        'Food',
        'Other',
      ],
    },
    // External marketplace information (Jumia, Amazon, etc.)
    marketplace: {
      type: String,
      required: [true, 'Product marketplace is required'],
      enum: ['jumia', 'amazon', 'aliexpress', 'ebay', 'other'],
      lowercase: true,
      index: true,
    },
    productId: {
      type: String,
      required: [true, 'External product ID is required'],
      trim: true,
      index: true,
    },
    productUrl: {
      type: String,
      required: [true, 'Product URL is required'],
      trim: true,
    },
    affiliateLink: {
      type: String,
      trim: true,
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Pre-Order', 'Unknown'],
      default: 'Unknown',
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    brand: {
      type: String,
      required: false,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      alias: 'reviewsCount',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    // Metadata for chat assistant and caching
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    specifications: {
      type: Map,
      of: String,
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
    // Raw scraped data for debugging/reprocessing
    raw: {
      type: mongoose.Schema.Types.Mixed,
      select: false, // Don't include in queries by default
    },
  },
  {
    timestamps: true,
  },
);

// Compound unique index for marketplace + productId
productSchema.index({ marketplace: 1, productId: 1 }, { unique: true });

// Compound unique index for marketplace + productId
productSchema.index({ marketplace: 1, productId: 1 }, { unique: true });

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ marketplace: 1, scrapedAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
