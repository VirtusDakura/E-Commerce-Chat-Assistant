import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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

// Trust proxy (required for rate limiting behind Render's reverse proxy)
app.set('trust proxy', 1);

// ============ Security Headers ============
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
}));

// ============ CORS Configuration ============
// Define allowed origins based on environment
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://ai-ecom-chat-assistant.vercel.app', // Production frontend
  process.env.FRONTEND_URL, // Your Vercel production URL (backup)
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (health checks, mobile apps, Postman, server-to-server, etc.)
    // These are safe because CORS only protects browser-based cross-origin requests
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV !== 'production') {
      // Be more permissive in development
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400, // Cache preflight requests for 24 hours
};

// Middleware
app.use(cors(corsOptions));

// Body parsing with size limits for AI payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Health check route (required by Render for health monitoring)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-Commerce Chat Assistant API - AI-Powered Product Discovery',
    status: 'Server is running',
    description: 'Chat with AI to discover products from multiple platforms (Jumia, Amazon, etc.)',
  });
});

// Detailed health check for monitoring
app.get('/health', async (req, res) => {
  const mongoose = (await import('mongoose')).default;

  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: mongoose.connection.readyState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
    },
  };

  // Set status based on DB connection
  if (!healthStatus.database.connected) {
    healthStatus.status = 'degraded';
    return res.status(503).json(healthStatus);
  }

  res.json(healthStatus);
});

// 404 handler
app.use('*', notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
