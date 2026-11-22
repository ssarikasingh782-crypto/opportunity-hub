const jwt = require('jsonwebtoken');

/**
 * Generate signed JWT authentication token
 * Payload contains user ID and role for fast authorization checks
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    {
      id: userId,
      role: role,
    },
    process.env.JWT_SECRET || 'fallback_development_secret_key_123456',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

module.exports = generateToken;
