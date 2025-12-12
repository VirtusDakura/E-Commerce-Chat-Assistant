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

        {/* Product Grid - Horizontal scroll on mobile, grid on sm+ */}
        {products.length > 0 && (
          <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3 lg:gap-4 sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
            {products.map((product) => (
              <div key={product.productId || product._id || product.id} className="shrink-0 w-[260px] sm:w-auto snap-start">
                <ChatProductCard
                  product={product}
                />
              </div>
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
