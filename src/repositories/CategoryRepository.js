const Category = require('../models/Category');

class CategoryRepository {
  // Create new category
  async create(categoryData) {
    return await Category.create(categoryData);
  }

  // Find category by ID
  async findById(id) {
    return await Category.findById(id);
  }

  // Find all categories
  async findAll() {
    return await Category.find().sort({ name: 1 });
  }

  // Find category by name (case insensitive)
  async findByName(name) {
    return await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });
  }

  // Find category by name excluding current ID (for updates)
  async findByNameExcludingId(name, excludeId) {
    return await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: excludeId },
    });
  }

  // Update category by ID
  async updateById(id, updateData, options = {}) {
    return await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      ...options,
    });
  }

  // Delete category by ID
  async deleteById(id) {
    return await Category.findByIdAndDelete(id);
  }

  // Check if subcategory exists in category
  async hasSubcategory(categoryId, subcategory) {
    const category = await Category.findById(categoryId);
    return category && category.subcategories.includes(subcategory);
  }
}

module.exports = new CategoryRepository();
