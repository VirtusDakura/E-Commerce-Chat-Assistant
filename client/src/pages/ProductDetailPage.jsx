import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiExternalLink,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiMessageCircle,
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import Spinner from '../components/ui/Spinner';
import { ProductImageGallery } from '../components/product';
import { useCartStore, useWishlistStore } from '../store';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { wishlistService } from '../services/wishlistService';
import { toast } from '../components/ui/Toast';

// Format price with currency (GHS for Jumia Ghana)
const formatPrice = (price, currency = 'GHS') => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

const ProductDetailPage = () => {
  // URL format: /product/:marketplace/:productId
  const { marketplace = 'jumia', productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const addToCartLocal = useCartStore((state) => state.addItem);
  const isInCart = useCartStore((state) => state.isInCart(productId || ''));
  const toggleWishlistLocal = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(productId || ''));

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await productService.getProduct(`${marketplace}/${productId}`);
        if (isMounted && response.data) {
          setProduct(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load product');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
    
    return () => {
      isMounted = false;
    };
  }, [marketplace, productId]);

  const handleAddToCart = async () => {
    if (product) {
      // Add locally for immediate feedback
      addToCartLocal({
        id: product.productId || product._id,
        _id: product._id,
        name: product.name || product.title,
        price: product.price,
        image: product.images?.[0] || product.image,
        productUrl: product.externalUrl || product.productUrl,
        marketplace: product.marketplace || marketplace,
      }, quantity);

      // Sync with backend if product has MongoDB ID
      if (product._id) {
        try {
          await cartService.addToCart(product._id, quantity);
        } catch (err) {
          console.error('Failed to sync cart with backend:', err);
        }
      }
      
      toast.success('Added to Cart', `${product.name || product.title} added to cart`);
    }
  };

  const handleToggleWishlist = async () => {
    if (product) {
      // Toggle locally
      toggleWishlistLocal({
        id: product.productId || product._id,
        _id: product._id,
        name: product.name || product.title,
        price: product.price,
        image: product.images?.[0] || product.image,
        productUrl: product.externalUrl || product.productUrl,
        marketplace: product.marketplace || marketplace,
      });

      // Sync with backend
      if (product._id) {
        try {
          if (isInWishlist) {
            toast.info('Removed from Wishlist');
          } else {
            await wishlistService.addToWishlist(product._id);
            toast.success('Added to Wishlist');
          }
        } catch (err) {
          console.error('Failed to sync wishlist with backend:', err);
        }
      }
    }
  };

  const handleBuyNow = () => {
    const productUrl = product?.externalUrl || product?.productUrl;
    if (productUrl) {
      window.open(productUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error || 'Product Not Found'}
            </h1>
            <p className="text-gray-600 mb-8">
              This product may have been removed or the link is incorrect. 
              Try chatting with our AI to find what you're looking for!
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/chat">
                <Button size="lg" leftIcon={<FiMessageCircle className="w-5 h-5" />}>
                  Chat with AI
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline" leftIcon={<FiArrowLeft className="w-5 h-5" />}>
                  Go Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const productName = product.name || product.title;
  const productImages = product.images?.length > 0 ? product.images : [product.image];
  const productUrl = product.externalUrl || product.productUrl;

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
            to="/chat"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Chat
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
                images={productImages}
                productName={productName}
              />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Category & Marketplace */}
              <div className="flex items-center gap-2">
                {product.category && <Badge variant="primary">{product.category}</Badge>}
                <Badge variant="warning" className="capitalize">
                  <FiExternalLink className="w-3 h-3 mr-1 inline" />
                  {product.marketplace || marketplace}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {productName}
              </h1>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-3">
                  <Rating value={product.rating} showValue count={product.numReviews || product.reviewsCount} />
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(product.price, product.currency || 'GHS')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.originalPrice, product.currency || 'GHS')}
                    </span>
                    <Badge variant="danger">
                      Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </Badge>
                  </>
                )}
              </div>

              {/* Availability */}
              <div>
                {product.availability === 'In Stock' || product.inStock !== false ? (
                  <span className="text-green-600 font-medium">✓ Available</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Description Preview */}
              {product.description && (
                <p className="text-gray-600 line-clamp-3">{product.description}</p>
              )}

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
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
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

              {/* Buy on External Site */}
              {productUrl && (
                <Button
                  size="lg"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  leftIcon={<FiExternalLink className="w-5 h-5" />}
                  onClick={handleBuyNow}
                >
                  Buy on {product.marketplace?.charAt(0).toUpperCase() + product.marketplace?.slice(1) || 'Jumia'} Ghana
                </Button>
              )}

              {/* Notice */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> This product is sold by {product.marketplace || 'Jumia'} Ghana. 
                  Clicking "Buy" will take you to the external marketplace to complete your purchase.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Product Details */}
        {product.description && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {/* Brand Info */}
        {product.brand && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Brand</h2>
            <p className="text-gray-600">{product.brand}</p>
          </div>
        )}

        {/* Back to Chat CTA */}
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Need help finding more products?</p>
          <Link to="/chat">
            <Button size="lg" leftIcon={<FiMessageCircle className="w-5 h-5" />}>
              Chat with ShopSmart AI
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
