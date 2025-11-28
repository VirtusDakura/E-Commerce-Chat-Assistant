import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // Save the price when added for price tracking
    savedPrice: {
      type: Number,
      required: true,
    },
    // Track if price has changed since adding
    priceChanged: {
      type: Boolean,
      default: false,
    },
    // Enable price alerts
    priceAlertEnabled: {
      type: Boolean,
      default: false,
    },
    targetPrice: {
      type: Number,
      default: null,
    },
    // User notes about the product
    notes: {
      type: String,
      maxlength: 500,
    },
    // Priority level (high, medium, low)
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    // Track when added for sorting
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [wishlistItemSchema],
    // Collections/folders for organization
    collections: {
      type: Map,
      of: [mongoose.Schema.Types.ObjectId], // Array of item IDs
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'items.product': 1 });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
