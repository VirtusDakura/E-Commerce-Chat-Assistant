import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { cn } from '../../lib/utils';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import { useCartStore, useWishlistStore } from '../../store';
import { formatPrice } from '../../lib/utils';

const ProductCard = ({ product, index = 0 }) => {
  const addToCart = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const isInCart = useCartStore((state) => state.isInCart(product.id));

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <Link to={`/product/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="primary" size="sm" rounded>
                New
              </Badge>
            )}
            {product.discount && (
              <Badge variant="danger" size="sm" rounded>
                -{product.discount}%
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'p-2 rounded-full shadow-md transition-colors',
                isInWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
              )}
            >
              <FiHeart className={cn('w-4 h-4', isInWishlist && 'fill-current')} />
            </button>
            <span
              className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <FiEye className="w-4 h-4" />
            </span>
          </div>

          {/* Add to Cart Button */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
            <button
              onClick={handleAddToCart}
              className={cn(
                'w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors',
                isInCart
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-900 hover:bg-blue-600 hover:text-white'
              )}
            >
              <FiShoppingCart className="w-4 h-4" />
              {isInCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              {product.category}
            </p>
          )}

          {/* Name */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="mb-2">
              <Rating value={product.rating} size="sm" count={product.reviewCount} />
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
