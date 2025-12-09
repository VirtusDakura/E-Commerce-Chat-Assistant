import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiExternalLink } from 'react-icons/fi';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Rating from '../ui/Rating';
import { useCartStore, useWishlistStore } from '../../store';
import { toast } from '../ui/Toast';
import { cartAPI, wishlistAPI } from '../../services/api';

// Format price with currency (GHS for Jumia Ghana)
const formatPrice = (price, currency = 'GHS') => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

const ChatProductCard = ({ product, compact = false }) => {
  const addToCartLocal = useCartStore((state) => state.addItem);
  const toggleWishlistLocal = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => 
    state.isInWishlist(product.productId || product._id)
  );
  const isInCart = useCartStore((state) => 
    state.isInCart(product.productId || product._id)
  );

  // Product has: marketplace, productId, title, price, currency, image, rating, reviewsCount, productUrl
  const productName = product.title || product.name;
  const productImage = product.image || product.images?.[0];
  const productPrice = product.price;
  const productCurrency = product.currency || 'GHS';
  const productUrl = product.productUrl;
  const productDbId = product._id; // MongoDB ID for cart/wishlist operations

  const handleAddToCart = async () => {
    addToCartLocal({
      id: product.productId || product._id,
      name: productName,
      price: productPrice,
      image: productImage,
      productUrl: productUrl,
      marketplace: product.marketplace,
    });

    if (productDbId) {
      try {
        await cartAPI.addToCart(productDbId);
        toast.success('Added to Cart', `${productName} has been added to your cart`);
      } catch {
        toast.success('Added to Cart', `${productName} has been added to your cart`);
      }
    } else {
      toast.success('Added to Cart', `${productName} has been added to your cart`);
    }
  };

  const handleToggleWishlist = async () => {
    toggleWishlistLocal({
      id: product.productId || product._id,
      name: productName,
      price: productPrice,
      image: productImage,
      productUrl: productUrl,
      marketplace: product.marketplace,
    });

    if (productDbId) {
      try {
        if (isInWishlist) {
          toast.info('Removed from Wishlist', `${productName} removed`);
        } else {
          await wishlistAPI.addToWishlist(productDbId);
          toast.success('Added to Wishlist', `${productName} saved to wishlist`);
        }
      } catch {
        toast.success('Updated Wishlist', 'Wishlist updated');
      }
    } else {
      toast.success('Updated Wishlist', 'Wishlist updated');
    }
  };

  const handleBuyNow = () => {
    // Open external product URL in new tab
    if (productUrl) {
      window.open(productUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <img
          src={productImage}
          alt={productName}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate">{productName}</h4>
          <p className="text-blue-600 font-semibold">{formatPrice(productPrice, productCurrency)}</p>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={handleAddToCart}>
            <FiShoppingCart className="w-4 h-4" />
          </Button>
          {productUrl && (
            <Button size="sm" onClick={handleBuyNow} title="Buy on Jumia">
              <FiExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleToggleWishlist}
          className={cn(
            'absolute top-2 right-2 p-2 rounded-full transition-colors',
            isInWishlist
              ? 'bg-red-100 text-red-500'
              : 'bg-white/90 text-gray-600 hover:text-red-500'
          )}
        >
          <FiHeart className={cn('w-4 h-4', isInWishlist && 'fill-current')} />
        </button>
        {/* Marketplace Badge */}
        {product.marketplace && (
          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded-full capitalize">
            {product.marketplace}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
            {productName}
          </h4>
        </div>

        {product.rating > 0 && (
          <div className="mb-2">
            <Rating value={product.rating} size="sm" count={product.reviewsCount} />
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-blue-600">
            {formatPrice(productPrice, productCurrency)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isInCart ? 'outline' : 'primary'}
            onClick={handleAddToCart}
            className="flex-1"
            leftIcon={<FiShoppingCart className="w-4 h-4" />}
          >
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </Button>
          {productUrl && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleBuyNow}
              title="Buy on Jumia"
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <FiExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatProductCard;
