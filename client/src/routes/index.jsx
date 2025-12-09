import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import {
  HomePage,
  AboutPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
  LoginPage,
  SignupPage,
  CartPage,
  WishlistPage,
  ChatPage,
  ProductDetailPage,
  NotFoundPage,
} from '../pages';

// Auth guard component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('auth-token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Guest route (redirect if already logged in)
const GuestRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('auth-token');
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Routes configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'wishlist',
        element: <WishlistPage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'product/:marketplace/:productId',
        element: <ProductDetailPage />,
      },
      {
        path: 'product/:productId',
        element: <ProductDetailPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <GuestRoute>
        <SignupPage />
      </GuestRoute>
    ),
  },
]);

export default router;
