import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMessageCircle,
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiZap,
  FiCpu,
  FiTruck,
  FiShield,
  FiArrowRight,
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ProductGrid } from '../components/product';

// Mock featured products
const featuredProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones Pro',
    price: 79.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    rating: 4.5,
    reviewCount: 128,
    category: 'Electronics',
    discount: 38,
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    rating: 4.8,
    reviewCount: 256,
    category: 'Electronics',
    isNew: true,
  },
  {
    id: '3',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    rating: 4.3,
    reviewCount: 89,
    category: 'Fashion',
  },
  {
    id: '4',
    name: 'Portable Bluetooth Speaker',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    rating: 4.6,
    reviewCount: 167,
    category: 'Electronics',
    discount: 28,
  },
];

// Categories
const categories = [
  {
    name: 'Electronics',
    icon: '🔌',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    count: 1250,
  },
  {
    name: 'Fashion',
    icon: '👕',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    count: 2340,
  },
  {
    name: 'Home & Garden',
    icon: '🏡',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
    count: 890,
  },
  {
    name: 'Books',
    icon: '📚',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    count: 1560,
  },
];

// Features
const features = [
  {
    icon: FiCpu,
    title: 'AI-Powered Search',
    description: 'Our intelligent AI understands what you\'re looking for and suggests the perfect products.',
  },
  {
    icon: FiMessageCircle,
    title: 'Chat Assistant',
    description: 'Get personalized recommendations through natural conversation with our AI shopping assistant.',
  },
  {
    icon: FiTruck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over $50 with express delivery options available.',
  },
  {
    icon: FiShield,
    title: 'Secure Shopping',
    description: 'Your data is protected with enterprise-grade security and encrypted transactions.',
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                <FiZap className="w-4 h-4" />
                AI-Powered Shopping Experience
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Shop Smarter with
                <span className="block text-blue-200">AI Assistant</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-lg">
                Discover the perfect products through intelligent conversation. 
                Our AI understands your needs and recommends exactly what you're looking for.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/chat">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                    leftIcon={<FiMessageCircle className="w-5 h-5" />}
                  >
                    Chat Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Hero Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Chat Preview Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <FiMessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">ShopSmart AI</h4>
                      <p className="text-xs text-green-500">Online now</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 max-w-[80%]">
                      Hi! I can help you find the perfect products. What are you looking for today?
                    </div>
                    <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white max-w-[80%] ml-auto">
                      I need wireless headphones under $100
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 max-w-[80%]">
                      Great choice! I found 3 top-rated options for you... ✨
                    </div>
                  </div>
                </div>
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  <FiShoppingCart className="w-4 h-4 inline mr-2" />
                  Added to Cart!
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  <FiHeart className="w-4 h-4 inline mr-2" />
                  Saved!
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How AI Shopping Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience a revolutionary way to shop online with our intelligent assistant
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated" className="p-6 text-center h-full hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-600">Browse products across popular categories</p>
            </div>
            <Link to="/categories" className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all">
              View All <FiArrowRight />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/category/${category.name.toLowerCase()}`}>
                  <div className="group relative aspect-square rounded-2xl overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <span className="text-3xl mb-2 block">{category.icon}</span>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-white/70">{category.count.toLocaleString()} products</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">Handpicked products just for you</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all">
              View All <FiArrowRight />
            </Link>
          </motion.div>

          <ProductGrid products={featuredProducts} columns={4} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Let our AI assistant help you find exactly what you're looking for.
              Start a conversation now and discover amazing products!
            </p>
            <Link to="/chat">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                leftIcon={<FiMessageCircle className="w-5 h-5" />}
              >
                Start Chatting
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
