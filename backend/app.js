import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-Commerce Chat Assistant API - AI-Powered Product Discovery',
    status: 'Server is running',
    description: 'Chat with AI to discover products from multiple platforms (Jumia, Amazon, etc.)',
  });
});

// 404 handler
app.use('*', notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
