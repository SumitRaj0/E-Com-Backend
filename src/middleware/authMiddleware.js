const AuthService = require('../services/AuthService');
const {
  AuthenticationError,
  AuthorizationError,
  asyncHandler,
} = require('../utils/errors');

// Verify JWT token and authenticate user
const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new AuthenticationError('Access denied. No token provided');
  }

  const user = await AuthService.verifyToken(token);
  req.user = user;
  next();
});

// Check if user has required role permissions
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError('Access denied. Insufficient permissions');
    }
    next();
  };
};

module.exports = { authenticate, authorize };
