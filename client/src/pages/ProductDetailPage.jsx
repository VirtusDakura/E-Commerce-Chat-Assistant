import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiMinus,
  FiPlus,
  FiArrowLeft,
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import Spinner from '../components/ui/Spinner';
import { ProductImageGallery, ProductReviews, ProductGrid } from '../components/product';
import { useCartStore, useWishlistStore } from '../store';
import { formatPrice } from '../lib/utils';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Wireless Bluetooth Headphones Pro - Premium Noise Cancelling',
  description: `Experience superior sound quality with our Premium Wireless Bluetooth Headphones. 
  
  Features:
  • Active Noise Cancellation (ANC) technology
  • 40-hour battery life
  • Hi-Res Audio certified
  • Comfortable over-ear design
  • Multi-device connectivity
  • Touch controls
  • Built-in microphone for calls
  
  Perfect for music lovers, gamers, and professionals who demand the best audio experience. The ergonomic design ensures comfort during extended use, while the premium materials guarantee durability.`,
  price: 79.99,
  originalPrice: 129.99,
  discount: 38,
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600',
  ],
  rating: 4.5,
  reviewCount: 128,
  category: 'Electronics',
  brand: 'AudioTech',
  inStock: true,
  stockCount: 15,
  specifications: [
    { label: 'Driver Size', value: '40mm' },
    { label: 'Frequency Response', value: '20Hz - 40kHz' },
    { label: 'Impedance', value: '32 Ohm' },
    { label: 'Battery Life', value: '40 hours' },
    { label: 'Charging Time', value: '2 hours' },
    { label: 'Bluetooth Version', value: '5.2' },
    { label: 'Weight', value: '250g' },
  ],
};

// Mock related products
const relatedProducts = [
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    rating: 4.8,
    reviewCount: 256,
    category: 'Electronics',
  },
  {
    id: '3',
    name: 'Portable Bluetooth Speaker',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    rating: 4.6,
    reviewCount: 167,
    category: 'Electronics',
  },
  {
    id: '4',
    name: 'Wireless Earbuds Pro',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    rating: 4.7,
    reviewCount: 89,
    category: 'Electronics',
  },
  {
    id: '5',
    name: 'USB-C Charging Cable',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    rating: 4.4,
    reviewCount: 312,
    category: 'Electronics',
  },
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const addToCart = useCartStore((state) => state.addItem);
  const isInCart = useCartStore((state) => state.isInCart(id || ''));
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(id || ''));

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      setProduct({ ...mockProduct, id: id || '1' });
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          category: product.category,
        },
        quantity
      );
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        rating: product.rating,
        category: product.category,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <Link to="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </motion.div>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ProductImageGallery
                images={product.images}
                productName={product.name}
              />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Category & Brand */}
              <div className="flex items-center gap-2">
                <Badge variant="primary">{product.category}</Badge>
                <span className="text-gray-500">by {product.brand}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <Rating value={product.rating} showValue count={product.reviewCount} />
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge variant="danger">Save {product.discount}%</Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div>
                {product.inStock ? (
                  <span className="text-green-600 font-medium">
                    ✓ In Stock ({product.stockCount} available)
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stockCount}
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  leftIcon={<FiShoppingCart className="w-5 h-5" />}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {isInCart ? 'Added to Cart' : 'Add to Cart'}
                </Button>
                <Button
                  size="lg"
                  variant={isInWishlist ? 'primary' : 'outline'}
                  onClick={handleToggleWishlist}
                >
                  <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
                <Button size="lg" variant="outline">
                  <FiShare2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <FiTruck className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <FiShield className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">2 Year Warranty</p>
                </div>
                <div className="text-center">
                  <FiRefreshCw className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">30 Day Returns</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          {/* Tab Headers */}
          <div className="border-b border-gray-100">
            <div className="flex gap-8 px-6">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-gray max-w-none"
              >
                <p className="whitespace-pre-line text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </motion.div>
            )}

            {activeTab === 'specifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {product.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between py-3 border-b border-gray-100"
                  >
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="font-medium text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ProductReviews
                  averageRating={product.rating}
                  totalReviews={product.reviewCount}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
