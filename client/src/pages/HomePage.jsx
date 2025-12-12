import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMessageCircle,
  FiShoppingCart,
  FiHeart,
  FiZap,
  FiTruck,
  FiShield,
  FiExternalLink,
  FiSend,
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// How it works steps
const howItWorks = [
  {
    step: 1,
    title: 'Start a Conversation',
    description: 'Tell our AI what you\'re looking for in natural language - just like chatting with a friend',
    icon: FiMessageCircle,
    color: 'blue',
  },
  {
    step: 2,
    title: 'Get Recommendations',
    description: 'Our AI searches Jumia Ghana and finds the best products matching your needs',
    icon: FiZap,
    color: 'purple',
  },
  {
    step: 3,
    title: 'Save Your Favorites',
    description: 'Add products to your cart or wishlist to keep track of items you love',
    icon: FiHeart,
    color: 'red',
  },
  {
    step: 4,
    title: 'Buy on Jumia',
    description: 'Click to purchase directly on Jumia Ghana - secure and reliable shopping',
    icon: FiExternalLink,
    color: 'green',
  },
];

// Features of the AI assistant
const features = [
  {
    icon: FiMessageCircle,
    title: 'Natural Conversations',
    description: 'Chat naturally with our AI - ask questions, refine searches, and get personalized help',
  },
  {
    icon: FiZap,
    title: 'Smart Recommendations',
    description: 'AI-powered product matching from Jumia Ghana\'s extensive catalog',
  },
  {
    icon: FiTruck,
    title: 'Real Products',
    description: 'All products come directly from Jumia Ghana with real prices in GHS',
  },
  {
    icon: FiShield,
    title: 'Secure & Trusted',
    description: 'Buy confidently through Jumia\'s secure platform with buyer protection',
  },
];

// Sample prompts to show users
const samplePrompts = [
  'I need a smartphone under 2000 GHS with good camera',
  'Show me gaming laptops for students',
  'What\'s a good washing machine for a family of 4?',
  'I want wireless earbuds for running',
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-4 sm:mb-6">
                <FiZap className="w-3 h-3 sm:w-4 sm:h-4" />
                Powered by AI • Products from Jumia Ghana
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
                Shop Smarter with
                <span className="block text-blue-200">Your AI Assistant</span>
              </h1>
              <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8 max-w-lg">
                Tell us what you need, and our AI will find the perfect products from Jumia Ghana.
                No more endless searching - just natural conversation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/chat">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                    leftIcon={<FiMessageCircle className="w-5 h-5" />}
                  >
                    Start Chatting
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Chat Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative">
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <FiMessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">ShopSmart AI</h3>
                    <span className="text-sm text-green-500">● Online</span>
                  </div>
                </div>

                {/* Chat Messages Preview */}
                <div className="py-6 space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm max-w-[80%]">
                      I need a good phone under 2000 GHS
                    </div>
                  </div>
                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 max-w-[80%]">
                      I found some great options! 📱 Here are 3 phones under 2000 GHS with excellent reviews...
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-hidden">
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3 min-w-[100px] sm:min-w-[140px]">
                      <div className="w-full h-12 sm:h-16 bg-gray-200 rounded mb-2"></div>
                      <p className="text-xs text-gray-600 truncate">Samsung Galaxy A24</p>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">GHS 1,899</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3 min-w-[100px] sm:min-w-[140px]">
                      <div className="w-full h-12 sm:h-16 bg-gray-200 rounded mb-2"></div>
                      <p className="text-xs text-gray-600 truncate">Xiaomi Redmi 12</p>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">GHS 1,650</p>
                    </div>
                  </div>
                </div>

                {/* Input Preview */}
                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                  <span className="text-gray-400 text-sm flex-1">Ask me anything...</span>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FiSend className="w-4 h-4 text-white" />
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
                  Wishlisted!
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Sample Prompts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Try Asking...
            </h2>
            <p className="text-gray-600">Click any prompt to start shopping</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {samplePrompts.map((prompt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/chat?prompt=${encodeURIComponent(prompt)}`}
                  className="block"
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <FiMessageCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{prompt}</p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From conversation to purchase in just a few simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-200" />
                )}

                <div className="relative text-center">
                  {/* Step Number */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center relative z-10 ${item.color === 'blue' ? 'bg-blue-100' :
                      item.color === 'purple' ? 'bg-purple-100' :
                        item.color === 'red' ? 'bg-red-100' :
                          'bg-green-100'
                    }`}>
                    <item.icon className={`w-8 h-8 ${item.color === 'blue' ? 'text-blue-600' :
                        item.color === 'purple' ? 'text-purple-600' :
                          item.color === 'red' ? 'text-red-600' :
                            'text-green-600'
                      }`} />
                    <span className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${item.color === 'blue' ? 'bg-blue-600' :
                        item.color === 'purple' ? 'bg-purple-600' :
                          item.color === 'red' ? 'bg-red-600' :
                            'bg-green-600'
                      }`}>
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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
              Why Shop With AI?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience a smarter way to find products on Jumia Ghana
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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

      {/* Info Banner */}
      <section className="py-12 bg-blue-50 border-y border-blue-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-16 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiExternalLink className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Real Products</h4>
                <p className="text-sm text-gray-600">From Jumia Ghana</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiShield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Secure Checkout</h4>
                <p className="text-sm text-gray-600">Buy directly on Jumia</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FiTruck className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Ghana Delivery</h4>
                <p className="text-sm text-gray-600">Delivered to your door</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find What You Need?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Start a conversation with our AI and discover amazing products from Jumia Ghana.
              No more endless browsing - just tell us what you want!
            </p>
            <Link to="/chat">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                leftIcon={<FiMessageCircle className="w-5 h-5" />}
              >
                Start Shopping with AI
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
