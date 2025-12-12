import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2, FiExternalLink, FiMessageCircle } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Rating from '../components/ui/Rating';
import Spinner from '../components/ui/Spinner';
import { useWishlistStore, useCartStore, useAuthStore } from '../store';
import { toast } from '../components/ui/Toast';

// Format price with currency (GHS for Jumia Ghana)
const formatPrice = (price, currency = 'GHS') => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

const WishlistPage = () => {
  const { items, isLoading, removeItem, clearWishlist, fetchWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Fetch wishlist from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeItem(item.id);
    toast.success('Moved to Cart', `${item.name} has been added to your cart`);
  };

  const handleBuyNow = (productUrl) => {
    if (productUrl) {
      window.open(productUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

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
              Chat with our AI assistant to find products and save your favorites here!
            </p>
            <Link to="/chat">
              <Button size="lg" leftIcon={<FiMessageCircle className="w-5 h-5" />}>
                Find Products with AI
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
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">My Wishlist</h1>
            <p className="text-gray-600 text-sm sm:text-base">{items.length} items saved for later</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="elevated" className="overflow-hidden group">
                {/* Image */}
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Marketplace Badge */}
                  {item.marketplace && (
                    <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded-full capitalize">
                      {item.marketplace}
                    </span>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                    {item.name}
                  </h3>

                  {item.rating > 0 && (
                    <div className="mb-2">
                      <Rating value={item.rating} size="sm" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(item.price, item.currency)}
                    </span>
                    {/* Price change indicator */}
                    {item.savedPrice && item.price !== item.savedPrice && (
                      <span className={`text-xs px-2 py-0.5 rounded ${item.price < item.savedPrice
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }`}>
                        {item.price < item.savedPrice ? '↓ Price dropped!' : '↑ Price increased'}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      leftIcon={<FiShoppingCart className="w-4 h-4" />}
                      onClick={() => handleMoveToCart(item)}
                    >
                      Cart
                    </Button>
                    {item.productUrl && (
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                        leftIcon={<FiExternalLink className="w-4 h-4" />}
                        onClick={() => handleBuyNow(item.productUrl)}
                      >
                        Buy
                      </Button>
                    )}
                  </div>

                  {/* Added date */}
                  {item.addedAt && (
                    <p className="text-xs text-gray-400 mt-3 text-center">
                      Saved {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Back to Shopping */}
        <div className="mt-8 text-center">
          <Link to="/chat">
            <Button variant="ghost" leftIcon={<FiMessageCircle className="w-4 h-4" />}>
              Find More Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
