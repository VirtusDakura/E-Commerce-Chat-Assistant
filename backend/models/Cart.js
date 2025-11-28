import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    // Store price for reference only (actual purchase happens on external platform)
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    platform: {
      type: String,
      required: true,
    },
    externalUrl: {
      type: String,
      required: true,
    },
  },
  {
    _id: true,
  },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    // Group items by platform for easier checkout redirection
    platformGroups: {
      type: Map,
      of: [mongoose.Schema.Types.ObjectId],
    },
  },
  {
    timestamps: true,
  },
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
