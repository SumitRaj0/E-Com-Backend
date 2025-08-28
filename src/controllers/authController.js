const { validationResult } = require('express-validator');
const AuthService = require('../services/AuthService');
const { ValidationError, asyncHandler } = require('../utils/errors');

// Register new user with validation
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array()[0].msg);
  }

  const userData = req.body;
  const result = await AuthService.registerUser(userData);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    ...result,
  });
});

// Authenticate user and return token
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array()[0].msg);
  }

  const { email, password } = req.body;
  const result = await AuthService.loginUser(email, password);

  res.json({
    success: true,
    message: 'Login successful',
    ...result,
  });
});

// Get current user profile information
const getProfile = asyncHandler(async (req, res) => {
  const user = await AuthService.getUserProfile(req.user._id);

  res.json({
    success: true,
    user,
  });
});

module.exports = { register, login, getProfile };
