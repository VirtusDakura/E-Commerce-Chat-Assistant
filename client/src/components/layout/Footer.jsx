import { Link } from 'react-router-dom';
import { FiMessageCircle } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiMessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Shop<span className="text-blue-400">Smart</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
              Terms
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {currentYear} ShopSmart
          </p>
        </div>

        {/* Powered by note */}
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            Powered by AI • Products sourced from Jumia Ghana
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
