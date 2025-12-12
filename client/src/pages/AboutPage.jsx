import { motion } from 'framer-motion';
import { FiTarget, FiZap, FiShield, FiHeart, FiMessageCircle, FiShoppingBag, FiGlobe } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const features = [
  {
    icon: FiMessageCircle,
    title: 'Natural Conversations',
    description: 'Chat naturally with our AI - describe what you need in your own words.',
  },
  {
    icon: FiZap,
    title: 'AI-Powered Search',
    description: 'Our AI understands your needs and finds the perfect products from Jumia Ghana.',
  },
  {
    icon: FiShoppingBag,
    title: 'Real Products',
    description: 'All products come directly from Jumia Ghana with real-time prices in GHS.',
  },
  {
    icon: FiShield,
    title: 'Secure Shopping',
    description: 'Purchase confidently through Jumia\'s secure platform with buyer protection.',
  },
];

const howWeHelp = [
  {
    icon: FiTarget,
    title: 'Find What You Need',
    description: 'Tell us what you\'re looking for and we\'ll search through thousands of products.',
  },
  {
    icon: FiGlobe,
    title: 'Compare Options',
    description: 'Get recommendations tailored to your budget and preferences.',
  },
  {
    icon: FiHeart,
    title: 'Save Favorites',
    description: 'Add products to your cart or wishlist for easy access later.',
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">About ShopSmart AI</h1>
            <p className="text-lg text-blue-100">
              Your intelligent shopping assistant that makes finding products on
              Jumia Ghana as easy as having a conversation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is ShopSmart Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What is ShopSmart AI?
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ShopSmart AI is an intelligent e-commerce assistant that helps you discover
                  and shop for products on Jumia Ghana through natural conversation.
                </p>
                <p>
                  Instead of browsing through endless product listings, simply tell our AI
                  what you're looking for - whether it's "a phone under 2000 GHS with good camera"
                  or "birthday gift ideas for a tech lover" - and get personalized recommendations
                  instantly.
                </p>
                <p>
                  Our AI searches Jumia Ghana's catalog in real-time, finding products that match
                  your needs, budget, and preferences. You can save items to your wishlist,
                  add them to cart, and purchase directly on Jumia's secure platform.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-linear-to-br from-blue-100 to-blue-200 rounded-2xl p-8">
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <FiShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">ShopSmart AI</p>
                      <p className="text-xs text-green-500">● Online</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm">
                      I need a laptop for school work
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2 text-sm text-gray-700">
                    I found some great options! Here are laptops perfect for students with good performance and value... 💻
                  </div>
                </div>
              </div>
            </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need for a smarter shopping experience
            </p>
          </motion.div>

          {/* Horizontal scroll on mobile, grid on sm+ */}
          <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 md:gap-8 sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="shrink-0 w-[220px] sm:w-auto snap-start"
              >
                <Card variant="elevated" className="p-5 sm:p-6 text-center h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How We Help You Shop</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ShopSmart AI simplifies your shopping journey
            </p>
          </motion.div>

          {/* Horizontal scroll on mobile, grid on sm+ */}
          <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-2 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6 md:gap-8 sm:overflow-visible max-w-4xl mx-auto -mx-4 px-4 sm:mx-auto sm:px-0">
            {howWeHelp.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center shrink-0 w-[200px] sm:w-auto snap-start"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Source Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Products from Jumia Ghana
            </h2>
            <p className="text-gray-600 mb-6">
              All products displayed on ShopSmart AI are sourced directly from Jumia Ghana.
              When you're ready to purchase, you'll be directed to Jumia's secure platform
              where you can complete your order with confidence.
            </p>
            <p className="text-sm text-gray-500">
              Prices shown are in Ghana Cedis (GHS) and reflect current Jumia Ghana listings.
            </p>
          </motion.div>
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
              Ready to Shop Smarter?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Start a conversation with ShopSmart AI and discover how easy finding products can be.
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

export default AboutPage;
