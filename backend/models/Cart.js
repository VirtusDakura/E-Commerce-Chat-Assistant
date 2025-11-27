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
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
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
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
      min: [0, 'Subtotal cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    total: {
      type: Number,
      default: 0,
      min: [0, 'Total cannot be negative'],
    },
  },
  {
    timestamps: true,
  },
);

// Method to calculate cart totals
cartSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  
  // Tax calculation (10% of subtotal)
  this.tax = this.subtotal * 0.1;
  
  // Total = subtotal + tax
  this.total = this.subtotal + this.tax;
  
  // Round to 2 decimal places
  this.subtotal = Math.round(this.subtotal * 100) / 100;
  this.tax = Math.round(this.tax * 100) / 100;
  this.total = Math.round(this.total * 100) / 100;
};

// Pre-save middleware to calculate totals
cartSchema.pre('save', function (next) {
  this.calculateTotals();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
