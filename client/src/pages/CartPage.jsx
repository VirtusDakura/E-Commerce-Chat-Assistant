import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiExternalLink, FiMessageCircle } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { useCartStore, useAuthStore } from '../store';

// Format price with currency (GHS for Jumia Ghana)
const formatPrice = (price, currency = 'GHS') => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

const CartPage = () => {
  const {
    items,
    isLoading,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getSubtotal,
    getItemCount,
    getItemsByPlatform,
    fetchCart,
  } = useCartStore();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Fetch cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const subtotal = getSubtotal();
  const itemsByPlatform = getItemsByPlatform();

  const handleBuyOnPlatform = (productUrl) => {
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
              <FiShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Chat with our AI assistant to find products and add them to your cart!
            </p>
            <Link to="/chat">
              <Button size="lg" leftIcon={<FiMessageCircle className="w-5 h-5" />}>
                Start Shopping with AI
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
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600 text-sm sm:text-base">{getItemCount()} items from external marketplaces</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items Grouped by Platform */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(itemsByPlatform).map(([platform, platformItems]) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card variant="elevated" className="overflow-hidden">
                  {/* Platform Header */}
                  <div className="bg-orange-500 px-4 py-3 flex items-center justify-between">
                    <h3 className="text-white font-semibold capitalize flex items-center gap-2">
                      <FiExternalLink className="w-4 h-4" />
                      {platform} Ghana
                    </h3>
                    <span className="text-white/80 text-sm">
                      {platformItems.length} item{platformItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Platform Items */}
                  <div className="divide-y divide-gray-100">
                    {platformItems.map((item) => (
                      <div key={item.id} className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {/* Product Image */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded-lg"
                        />

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 line-clamp-2 text-sm sm:text-base">
                            {item.name}
                          </h4>
                          <p className="text-base sm:text-lg font-bold text-blue-600 mt-1">
                            {formatPrice(item.price, item.currency)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 sm:gap-2 mt-2">
                            <button
                              onClick={() => decrementQuantity(item.id)}
                              className="p-1 rounded border border-gray-200 hover:bg-gray-100"
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(item.id)}
                              className="p-1 rounded border border-gray-200 hover:bg-gray-100"
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity, item.currency)}
                          </p>
                          {item.productUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBuyOnPlatform(item.productUrl)}
                              className="text-orange-600 border-orange-300 hover:bg-orange-50"
                              leftIcon={<FiExternalLink className="w-3 h-3" />}
                            >
                              Buy
                            </Button>
                          )}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                          >
                            <FiTrash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4">
              <Link to="/chat">
                <Button variant="ghost" leftIcon={<FiMessageCircle className="w-4 h-4" />}>
                  Continue Shopping
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card variant="elevated" className="p-4 sm:p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Cart Summary</h2>

                {/* Info Notice */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> This is a shopping assistant. Purchases are made directly on external marketplaces like Jumia Ghana.
                  </p>
                </div>

                {/* Summary by Platform */}
                <div className="space-y-3 border-b border-gray-100 pb-4 mb-4">
                  {Object.entries(itemsByPlatform).map(([platform, platformItems]) => {
                    const platformTotal = platformItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    );
                    return (
                      <div key={platform} className="flex justify-between text-gray-600">
                        <span className="capitalize">{platform}</span>
                        <span>{formatPrice(platformTotal)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Total Estimate */}
                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Estimated Total</span>
                  <span className="text-blue-600">{formatPrice(subtotal)}</span>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  * Final prices, shipping, and taxes are calculated at checkout on each marketplace.
                </p>

                {/* Buy All Buttons */}
                <div className="space-y-2">
                  {Object.entries(itemsByPlatform).map(([platform, platformItems]) => (
                    <Button
                      key={platform}
                      size="lg"
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      onClick={() => {
                        // Open first product's URL as starting point
                        const firstItem = platformItems[0];
                        if (firstItem?.productUrl) {
                          handleBuyOnPlatform(firstItem.productUrl);
                        }
                      }}
                      leftIcon={<FiExternalLink className="w-4 h-4" />}
                    >
                      Shop on {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
