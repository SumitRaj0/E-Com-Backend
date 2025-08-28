const CategoryRepository = require('../repositories/CategoryRepository');
const { ValidationError, ConflictError } = require('../utils/errors');

class CategoryService {
  // Create new category
  async createCategory(categoryData) {
    const { name } = categoryData;

    // Check if category already exists
    const existingCategory = await CategoryRepository.findByName(name);
    if (existingCategory) {
      throw new ConflictError('Category with this name already exists');
    }

    const category = await CategoryRepository.create(categoryData);
    return category;
  }

  // Get all categories
  async getAllCategories() {
    return await CategoryRepository.findAll();
  }

  // Get category by ID
  async getCategoryById(categoryId) {
    const category = await CategoryRepository.findById(categoryId);
    if (!category) {
      throw new ValidationError('Category not found');
    }
    return category;
  }

  // Update category
  async updateCategory(categoryId, updateData) {
    const { name } = updateData;

    // Check if new name conflicts with existing category
    if (name) {
      const existingCategory = await CategoryRepository.findByNameExcludingId(
        name,
        categoryId
      );
      if (existingCategory) {
        throw new ConflictError('Category with this name already exists');
      }
    }

    const updatedCategory = await CategoryRepository.updateById(
      categoryId,
      updateData
    );
    return updatedCategory;
  }

  // Delete category
  async deleteCategory(categoryId) {
    const category = await CategoryRepository.findById(categoryId);
    if (!category) {
      throw new ValidationError('Category not found');
    }

    await CategoryRepository.deleteById(categoryId);
    return true;
  }

  // Check if subcategory exists in category
  async hasSubcategory(categoryId, subcategory) {
    return await CategoryRepository.hasSubcategory(categoryId, subcategory);
  }

  // Get categories with subcategories for frontend
  async getCategoriesForFrontend() {
    const categories = await CategoryRepository.findAll();
    return categories.map((cat) => ({
      id: cat._id,
      name: cat.name,
      subcategories: cat.subcategories,
    }));
  }
}

module.exports = new CategoryService();
