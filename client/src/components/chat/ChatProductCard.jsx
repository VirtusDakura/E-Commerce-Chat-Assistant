import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Rating from '../ui/Rating';
import { useCartStore, useWishlistStore } from '../../store';
import { formatPrice } from '../../lib/utils';

const ChatProductCard = ({ product, compact = false }) => {
  const addToCart = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate">{product.name}</h4>
          <p className="text-blue-600 font-semibold">{formatPrice(product.price)}</p>
        </div>
        <Button size="sm" onClick={handleAddToCart}>
          <FiShoppingCart className="w-4 h-4" />
        </Button>
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
          src={product.image}
          alt={product.name}
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
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
            {product.name}
          </h4>
        </div>

        {product.rating && (
          <div className="mb-2">
            <Rating value={product.rating} size="sm" showValue />
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-blue-600">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={handleAddToCart}
            className="flex-1"
            leftIcon={<FiShoppingCart className="w-4 h-4" />}
          >
            Add to Cart
          </Button>
          <Link to={`/product/${product.id}`}>
            <Button size="sm" variant="outline">
              <FiExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatProductCard;
