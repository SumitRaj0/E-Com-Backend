const User = require('../models/User');

class UserRepository {
  // Create new user
  async create(userData) {
    return await User.create(userData);
  }

  // Find user by ID
  async findById(id) {
    return await User.findById(id);
  }

  // Find user by ID excluding password
  async findByIdExcludePassword(id) {
    return await User.findById(id).select('-password');
  }

  // Find user by email
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  // Find user by email excluding password
  async findByEmailExcludePassword(email) {
    return await User.findOne({ email }).select('-password');
  }

  // Update user by ID
  async updateById(id, updateData, options = {}) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      ...options,
    });
  }

  // Check if user exists by email
  async existsByEmail(email) {
    return await User.exists({ email });
  }

  // Find user by ID for authentication
  async findByIdForAuth(id) {
    return await User.findById(id).select('-password');
  }
}

module.exports = new UserRepository();
