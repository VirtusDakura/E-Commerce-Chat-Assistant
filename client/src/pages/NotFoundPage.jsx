import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiMessageCircle } from 'react-icons/fi';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. 
          It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" leftIcon={<FiHome className="w-5 h-5" />}>
              Go Home
            </Button>
          </Link>
          <Link to="/chat">
            <Button
              size="lg"
              variant="outline"
              leftIcon={<FiMessageCircle className="w-5 h-5" />}
            >
              Chat with AI
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
