import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiAward, FiHeart, FiMessageCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const teamMembers = [
  {
    name: 'Alex Johnson',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  },
  {
    name: 'Michael Brown',
    role: 'Head of AI',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  },
  {
    name: 'Emily Davis',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
  },
];

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '100K+', label: 'Products' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'Rating' },
];

const values = [
  {
    icon: FiTarget,
    title: 'Customer First',
    description: 'Every decision we make starts with our customers in mind.',
  },
  {
    icon: FiAward,
    title: 'Quality',
    description: 'We curate only the best products and experiences.',
  },
  {
    icon: FiHeart,
    title: 'Transparency',
    description: 'Honest pricing, clear policies, no hidden surprises.',
  },
  {
    icon: FiUsers,
    title: 'Community',
    description: 'Building lasting relationships with our customers.',
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About ShopSmart</h1>
            <p className="text-lg text-blue-100">
              We're on a mission to revolutionize online shopping with AI-powered 
              assistance that understands your needs and helps you find exactly 
              what you're looking for.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  >
                    <span className="text-4xl md:text-5xl font-bold text-blue-600">
                      {stat.value}
                    </span>
                    <p className="text-gray-600 mt-2">{stat.label}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ShopSmart was founded in 2023 with a simple idea: what if shopping online 
                  could be as easy as having a conversation with a knowledgeable friend?
                </p>
                <p>
                  We saw how overwhelming it can be to browse through thousands of products, 
                  read countless reviews, and still feel unsure about making the right choice. 
                  That's why we built an AI-powered shopping assistant that truly understands 
                  your needs.
                </p>
                <p>
                  Today, ShopSmart helps thousands of customers find perfect products every day, 
                  saving them time and giving them confidence in their purchases. Our AI 
                  continues to learn and improve, making every shopping experience better 
                  than the last.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"
                alt="Our Team"
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                <p className="text-2xl font-bold">2023</p>
                <p className="text-sm text-blue-200">Founded</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at ShopSmart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated" className="p-6 text-center h-full">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind ShopSmart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                />
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-blue-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
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
              Experience AI-Powered Shopping
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Start a conversation with our AI assistant and discover how easy shopping can be.
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
