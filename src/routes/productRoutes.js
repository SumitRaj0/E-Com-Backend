const express = require('express');
const { body } = require('express-validator');
const {
  addProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getMerchantProducts,
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for adding/editing products
const productValidation = [
  body('title')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
];

// Public routes
router.get('/', getAllProducts);

// Protected routes (merchant only) - MUST come before /:id route
router.get(
  '/merchant',
  authenticate,
  authorize('merchant'),
  getMerchantProducts
);
router.get(
  '/merchant/my-products',
  authenticate,
  authorize('merchant'),
  getMerchantProducts
);
router.post(
  '/',
  authenticate,
  authorize('merchant'),
  productValidation,
  addProduct
);
router.put(
  '/:id',
  authenticate,
  authorize('merchant'),
  productValidation,
  editProduct
);
router.delete('/:id', authenticate, authorize('merchant'), deleteProduct);

// Public routes that should come last
router.get('/:id', getProductById);

module.exports = router;
