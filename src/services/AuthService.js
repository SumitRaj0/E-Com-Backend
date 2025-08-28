const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const {
  ValidationError,
  ConflictError,
  AuthenticationError,
} = require('../utils/errors');

class AuthService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || '7d',
    });
  }

  // Register new user
  async registerUser(userData) {
    const { email } = userData;

    // Check if user already exists
    const existingUser = await UserRepository.existsByEmail(email);
    if (existingUser) {
      throw new ConflictError('User already exists with this email');
    }

    // Create user (password will be hashed by model pre-save hook)
    const user = await UserRepository.create(userData);
    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  // Login user
  async loginUser(email, password) {
    // Find user by email
    const user = await UserRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  // Get user profile
  async getUserProfile(userId) {
    const user = await UserRepository.findByIdExcludePassword(userId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  // Verify JWT token
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserRepository.findByIdForAuth(decoded.id);

      if (!user || !user.isActive) {
        throw new AuthenticationError('Invalid token');
      }

      return user;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new AuthenticationError('Invalid token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token expired');
      }
      throw error;
    }
  }
}

module.exports = new AuthService();
