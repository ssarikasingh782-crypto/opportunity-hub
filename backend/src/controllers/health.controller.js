const mongoose = require('mongoose');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Check API and Database Health Status
 * @route   GET /health or GET /api/v1/health
 * @access  Public
 */
const getHealthStatus = asyncHandler(async (req, res) => {
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;
  const isHealthy = dbState === 1 || dbState === 2;

  const healthData = {
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    server: 'operational',
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      isConnected: dbState === 1,
    },
  };

  return ApiResponse.success(
    res,
    healthData,
    'Service health check passed successfully',
    isHealthy ? 200 : 200 // Return 200 so monitoring can inspect health payload
  );
});

module.exports = {
  getHealthStatus,
};
