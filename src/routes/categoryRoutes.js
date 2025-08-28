const express = require('express');
const { body } = require('express-validator');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const router = express.Router();

// Validation rules for categories
const categoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Category name must be at least 2 characters'),
  body('subcategories')
    .optional()
    .isArray()
    .withMessage('Subcategories must be an array'),
];

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes (can be restricted to admin later)
router.post('/', categoryValidation, createCategory);
router.put('/:id', categoryValidation, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
