import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price images platform externalUrl availability rating numReviews brand',
    );

    if (!cart) {
      // Create empty cart if none exists
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Group items by platform for easier checkout
    const platformGroups = {};
    let totalEstimate = 0;

    cart.items.forEach((item) => {
      const platform = item.platform;
      if (!platformGroups[platform]) {
        platformGroups[platform] = {
          platform,
          items: [],
          subtotal: 0,
          itemCount: 0,
        };
      }

      const itemTotal = item.price * item.quantity;
      platformGroups[platform].items.push(item);
      platformGroups[platform].subtotal += itemTotal;
      platformGroups[platform].itemCount += item.quantity;
      totalEstimate += itemTotal;
    });

    res.status(200).json({
      success: true,
      data: {
        cart,
        platformGroups: Object.values(platformGroups),
        totalEstimate,
        itemCount: cart.items.length,
        note: 'Checkout happens on external platforms. Click platform links to purchase.',
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching cart',
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID',
      });
    }

    const quantityToAdd = quantity || 1;

    if (quantityToAdd < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = cart.items[existingItemIndex].quantity + quantityToAdd;

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price;
    } else {
      // Add new item to cart with external link info
      // Map product fields to cart schema (marketplace -> platform, productUrl -> externalUrl)
      cart.items.push({
        product: productId,
        quantity: quantityToAdd,
        price: product.price,
        platform: product.platform || product.marketplace || 'unknown',
        externalUrl: product.externalUrl || product.productUrl || '',
      });
    }

    await cart.save();

    // Populate product details before sending response
    cart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price images platform externalUrl availability rating',
    );

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding item to cart',
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    // Check product stock
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // Update quantity and price
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;

    await cart.save();

    // Populate product details
    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price images stock',
    );

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: updatedCart,
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating cart item',
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    // Populate product details
    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price images stock',
    );

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: updatedCart,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing item from cart',
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error clearing cart',
    });
  }
};
