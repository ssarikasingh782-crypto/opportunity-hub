require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

// Handle uncaught exceptions before server starts
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION] Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Job & Internship Portal Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log('====================================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION] Shutting down server...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
