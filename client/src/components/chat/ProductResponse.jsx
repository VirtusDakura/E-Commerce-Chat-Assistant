import { FiShoppingBag } from 'react-icons/fi';
import ChatProductCard from './ChatProductCard';

const ProductResponse = ({ message }) => {
  const products = message.products || [];

  return (
    <div className="flex gap-4">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
        <FiShoppingBag className="w-4 h-4 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4">
        {/* Text Message */}
        {message.content && (
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        )}

        {/* Product Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
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
      </div>
    </div>
  );
};

export default ProductResponse;
