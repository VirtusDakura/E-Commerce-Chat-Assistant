import 'dotenv/config';
import app from './app.js';
import connectDB from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 http://localhost:${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('⚠️  SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('✅ HTTP server closed');
      });
    });

    process.on('SIGINT', () => {
      console.log('\n⚠️  SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

startServer();
