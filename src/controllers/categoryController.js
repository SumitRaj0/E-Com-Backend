const CategoryService = require('../services/CategoryService');
const { asyncHandler } = require('../utils/errors');

// Create new category (admin only - can be added later)
const createCategory = asyncHandler(async (req, res) => {
  const categoryData = req.body;
  const category = await CategoryService.createCategory(categoryData);

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    category,
  });
});

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryService.getAllCategories();

  res.json({
    success: true,
    categories,
  });
});

// Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryService.getCategoryById(id);

  res.json({
    success: true,
    category,
  });
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedCategory = await CategoryService.updateCategory(id, updateData);

  res.json({
    success: true,
    message: 'Category updated successfully',
    category: updatedCategory,
  });
});

// Delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await CategoryService.deleteCategory(id);

  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
