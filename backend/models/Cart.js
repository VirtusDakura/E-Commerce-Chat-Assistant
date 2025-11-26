const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
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
  price: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ 'items.product': 1 });

// Method to add item to cart
cartSchema.methods.addItem = async function (productId, quantity = 1, price) {
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === productId.toString(),
  );

  if (existingItemIndex > -1) {
    // Item already exists, update quantity
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      price,
    });
  }

  this.lastModified = Date.now();
  this.calculateTotals();
  await this.save();
  return this;
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = async function (productId, quantity) {
  const itemIndex = this.items.findIndex(
    item => item.product.toString() === productId.toString(),
  );

  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    this.items.splice(itemIndex, 1);
  } else {
    this.items[itemIndex].quantity = quantity;
  }

  this.lastModified = Date.now();
  this.calculateTotals();
  await this.save();
  return this;
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function (productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString(),
  );

  this.lastModified = Date.now();
  this.calculateTotals();
  await this.save();
  return this;
};

// Method to clear cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  this.lastModified = Date.now();
  this.calculateTotals();
  await this.save();
  return this;
};

// Method to calculate totals
cartSchema.methods.calculateTotals = function () {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Pre-save middleware to update totals
cartSchema.pre('save', function (next) {
  this.calculateTotals();
  next();
});

// Method to validate cart items against product inventory
cartSchema.methods.validateInventory = async function () {
  const Product = mongoose.model('Product');
  const validationErrors = [];

  for (const item of this.items) {
    const product = await Product.findById(item.product);

    if (!product) {
      validationErrors.push({
        productId: item.product,
        message: 'Product not found',
      });
      continue;
    }

    if (!product.isActive) {
      validationErrors.push({
        productId: item.product,
        name: product.name,
        message: 'Product is no longer available',
      });
      continue;
    }

    if (product.inventory.trackInventory && product.inventory.stock < item.quantity) {
      validationErrors.push({
        productId: item.product,
        name: product.name,
        message: `Only ${product.inventory.stock} items available`,
        availableStock: product.inventory.stock,
      });
    }

    // Update price if it has changed
    if (item.price !== product.price) {
      item.price = product.price;
    }
  }

  if (validationErrors.length > 0) {
    return { isValid: false, errors: validationErrors };
  }

  return { isValid: true, errors: [] };
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
