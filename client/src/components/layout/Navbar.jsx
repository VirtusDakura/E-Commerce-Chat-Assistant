import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingCart,
  FiHeart,
  FiMenu,
  FiX,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiMessageCircle,
} from 'react-icons/fi';
import { cn } from '../../lib/utils';
import { useCartStore, useWishlistStore, useAuthStore } from '../../store';
import Button from '../ui/Button';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistItemCount = useWishlistStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white'
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiMessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Shop<span className="text-blue-600">Smart</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors relative py-2',
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Chat Button - Always Visible */}
            <Link to="/chat">
              <Button
                variant="primary"
                size="sm"
                className="hidden sm:flex"
                leftIcon={<FiMessageCircle className="w-4 h-4" />}
              >
                Chat
              </Button>
              <Button
                variant="primary"
                size="icon"
                className="sm:hidden"
              >
                <FiMessageCircle className="w-5 h-5" />
              </Button>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <FiHeart className="w-6 h-6" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <FiShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                    <FiUser className="w-5 h-5" />
                    <span className="text-sm font-medium">{user?.name || 'Profile'}</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <FiLogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" leftIcon={<FiLogIn className="w-4 h-4" />}>
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="outline" size="sm" leftIcon={<FiUserPlus className="w-4 h-4" />}>
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <hr className="my-4" />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <FiUser className="w-5 h-5" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button variant="primary" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
