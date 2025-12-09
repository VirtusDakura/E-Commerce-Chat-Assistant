import { motion } from 'framer-motion';
import ChatProductCard from './ChatProductCard';
import Avatar from '../ui/Avatar';

const ProductResponse = ({ message }) => {
  // Products from backend come as 'recommendations' array with:
  // marketplace, productId, title, price, currency, image, rating, reviewsCount, productUrl
  const products = message.products || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 max-w-[90%] mr-auto"
    >
      {/* Avatar */}
      <div className="shrink-0">
        <Avatar
          name="AI"
          size="sm"
          className="bg-linear-to-br from-blue-500 to-blue-700 text-white"
        />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        {/* Text Message */}
        {message.content && (
          <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
            <p className="text-sm text-gray-800 leading-relaxed">
              {message.content}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((product) => (
              <ChatProductCard 
                key={product.productId || product._id || product.id} 
                product={product} 
              />
            ))}
          </div>
        )}

        {/* Product count info */}
        {products.length > 0 && (
          <p className="text-xs text-gray-500">
            Found {products.length} product{products.length !== 1 ? 's' : ''} on Jumia Ghana
          </p>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <p className="text-xs text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductResponse;
