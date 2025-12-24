import mongoose from 'mongoose';

/**
 * Production-ready MongoDB connection configuration
 */
const connectDB = async () => {
  try {
    // MongoDB connection options for production
    const options = {
      // Connection pool settings
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections

      // Timeouts
      serverSelectionTimeoutMS: 30000, // Time to wait for server selection (30s for cold starts)
      socketTimeoutMS: 45000, // Time to wait for socket operations (45s for AI queries)
      connectTimeoutMS: 30000, // Time to wait for connection

      // Retry settings
      retryWrites: true,
      retryReads: true,

      // Keep-alive to prevent disconnections
      heartbeatFrequencyMS: 10000,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // In production, exit process on DB connection failure
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
};

// Graceful shutdown handler
export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed gracefully');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
};

export default connectDB;
