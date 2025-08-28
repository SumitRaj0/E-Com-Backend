const express = require('express');
const { body } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getMerchantProducts,
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

const productValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().isLength({ min: 2 }).withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('images').optional().isArray().withMessage('Images must be an array'),
];

router.get('/merchant', authenticate, authorize('merchant'), getMerchantProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, authorize('merchant'), productValidation, createProduct);
router.put('/:id', authenticate, authorize('merchant'), productValidation, updateProduct);
router.delete('/:id', authenticate, authorize('merchant'), deleteProduct);

module.exports = router;