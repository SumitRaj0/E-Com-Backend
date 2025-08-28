const Product = require('../models/Product');
const mongoose = require('mongoose');

class ProductRepository {
  // Create new product
  async create(productData) {
    return await Product.create(productData);
  }

  // Find product by ID
  async findById(id) {
    return await Product.findById(id);
  }

  // Find product by ID with population
  async findByIdWithPopulate(id, populateOptions) {
    return await Product.findById(id).populate(populateOptions);
  }

  // Find products with pagination and filters
  async findWithPagination(query, options) {
    return await Product.paginate(query, options);
  }

  // Find products by merchant
  async findByMerchant(merchantId, query = {}, options = {}) {
    const finalQuery = { merchant: merchantId, isActive: true, ...query };
    return await Product.paginate(finalQuery, options);
  }

  // Update product by ID
  async updateById(id, updateData, options = {}) {
    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      ...options,
    });
  }

  // Delete product by ID
  async deleteById(id) {
    return await Product.findByIdAndDelete(id);
  }

  // Count products by merchant
  async countByMerchant(merchantId) {
    return await Product.countDocuments({
      merchant: merchantId,
      isActive: true,
    });
  }

  // Get price range statistics
  async getPriceRange() {
    return await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);
  }

  // Get category statistics for merchant
  async getCategoryStats(merchantId) {
    return await Product.aggregate([
      {
        $match: {
          merchant: new mongoose.Types.ObjectId(merchantId),
          isActive: true,
        },
      },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },
      { $project: { categoryName: '$categoryInfo.name', count: 1 } },
    ]);
  }

  // Get total value of products for merchant
  async getTotalValue(merchantId) {
    return await Product.aggregate([
      {
        $match: {
          merchant: new mongoose.Types.ObjectId(merchantId),
          isActive: true,
        },
      },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
  }
}

module.exports = new ProductRepository();
