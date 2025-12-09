import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiMessageCircle } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { useAuthStore } from '../store';
import { authService } from '../services/authService';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      // Call real backend API
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Handle successful registration
      const { user, token } = response.data;
      await login(user, token);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-blue-600 to-blue-800 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-white max-w-md"
        >
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiMessageCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join ShopSmart Today</h2>
          <p className="text-blue-100">
            Create an account to unlock personalized recommendations, 
            save your favorites, and enjoy a seamless shopping experience.
          </p>
          <div className="mt-8 space-y-3">
            {['AI-Powered Recommendations', 'Save Wishlist Items', 'Faster Checkout', 'Exclusive Deals'].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-2 text-blue-100"
              >
                <div className="w-2 h-2 bg-blue-300 rounded-full" />
                {feature}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiMessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Shop<span className="text-blue-600">Smart</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
          <p className="text-gray-600 mb-8">
            Sign up to start your AI-powered shopping journey
          </p>

          {error && (
            <Alert variant="error" className="mb-6" dismissible onDismiss={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              leftIcon={<FiUser className="w-5 h-5" />}
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<FiMail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<FiLock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-blue-600"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain uppercase, lowercase, and number',
                },
              })}
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<FiLock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="hover:text-blue-600"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                {...register('terms', {
                  required: 'You must accept the terms and conditions',
                })}
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-sm text-red-500">{errors.terms.message}</p>
            )}

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
