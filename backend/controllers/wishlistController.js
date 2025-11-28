import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name description price images category platform externalUrl availability rating numReviews brand',
    });

    // If no wishlist exists, create one
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        items: [],
        collections: new Map(),
      });
    }

    // Check for price changes
    const itemsWithPriceChanges = wishlist.items.map((item) => {
      const currentPrice = item.product.price;
      const priceDifference = currentPrice - item.savedPrice;
      const priceChangePercentage = ((priceDifference / item.savedPrice) * 100).toFixed(2);

      return {
        ...item.toObject(),
        currentPrice,
        savedPrice: item.savedPrice,
        priceChanged: currentPrice !== item.savedPrice,
        priceDifference,
        priceChangePercentage,
        priceDropped: currentPrice < item.savedPrice,
      };
    });

    res.status(200).json({
      success: true,
      count: wishlist.items.length,
      data: {
        ...wishlist.toObject(),
        items: itemsWithPriceChanges,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message,
    });
  }
};

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist
 * @access  Private
 */
export const addToWishlist = async (req, res) => {
  try {
    const { productId, notes, priority, priceAlertEnabled, targetPrice } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
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

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        items: [],
        collections: new Map(),
      });
    }

    // Check if product already in wishlist
    const existingItem = wishlist.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist',
      });
    }

    // Add to wishlist
    wishlist.items.push({
      product: productId,
      savedPrice: product.price,
      notes: notes || '',
      priority: priority || 'medium',
      priceAlertEnabled: priceAlertEnabled || false,
      targetPrice: targetPrice || null,
    });

    await wishlist.save();

    // Populate the product details before sending response
    await wishlist.populate({
      path: 'items.product',
      select: 'name description price images category platform externalUrl availability rating numReviews brand',
    });

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist',
      error: error.message,
    });
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:itemId
 * @access  Private
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item._id.toString() === req.params.itemId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist',
      });
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist',
      error: error.message,
    });
  }
};

/**
 * @desc    Update wishlist item (notes, priority, price alert)
 * @route   PUT /api/wishlist/:itemId
 * @access  Private
 */
export const updateWishlistItem = async (req, res) => {
  try {
    const { notes, priority, priceAlertEnabled, targetPrice } = req.body;
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    const item = wishlist.items.find(
      (item) => item._id.toString() === req.params.itemId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist',
      });
    }

    // Update fields
    if (notes !== undefined) {
      item.notes = notes;
    }
    if (priority !== undefined) {
      item.priority = priority;
    }
    if (priceAlertEnabled !== undefined) {
      item.priceAlertEnabled = priceAlertEnabled;
    }
    if (targetPrice !== undefined) {
      item.targetPrice = targetPrice;
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist item updated',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating wishlist item',
      error: error.message,
    });
  }
};

/**
 * @desc    Move items to cart
 * @route   POST /api/wishlist/move-to-cart
 * @access  Private
 */
export const moveToCart = async (req, res) => {
  try {
    const { itemIds } = req.body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Item IDs array is required',
      });
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items.product');

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    // This would integrate with your cart system
    // For now, just return the items that would be moved
    const itemsToMove = wishlist.items.filter((item) =>
      itemIds.includes(item._id.toString()),
    );

    res.status(200).json({
      success: true,
      message: 'Items ready to move to cart',
      data: itemsToMove,
      note: 'Integrate with cart controller to complete move',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error moving items to cart',
      error: error.message,
    });
  }
};

/**
 * @desc    Clear entire wishlist
 * @route   DELETE /api/wishlist
 * @access  Private
 */
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    wishlist.items = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing wishlist',
      error: error.message,
    });
  }
};
