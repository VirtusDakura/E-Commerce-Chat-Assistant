import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Rating from '../components/ui/Rating';
import { useWishlistStore, useCartStore } from '../store';
import { formatPrice } from '../lib/utils';

const WishlistPage = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeItem(item.id);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHeart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8">
              Save items you love by clicking the heart icon on any product. 
              They'll be waiting for you here!
            </p>
            <Link to="/">
              <Button size="lg" leftIcon={<FiArrowLeft className="w-5 h-5" />}>
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">{items.length} items saved</p>
          </div>
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-600"
            onClick={clearWishlist}
          >
            Clear All
          </Button>
        </motion.div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="elevated" className="overflow-hidden group">
                {/* Image */}
                <Link to={`/product/${item.id}`}>
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeItem(item.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Link>

                {/* Details */}
                <div className="p-4">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {item.name}
                    </h3>
                  </Link>

                  {item.rating && (
                    <div className="mb-2">
                      <Rating value={item.rating} size="sm" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    leftIcon={<FiShoppingCart className="w-4 h-4" />}
                    onClick={() => handleMoveToCart(item)}
                  >
                    Move to Cart
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Back to Shopping */}
        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="ghost" leftIcon={<FiArrowLeft className="w-4 h-4" />}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
