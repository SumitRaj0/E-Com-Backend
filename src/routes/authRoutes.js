const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getProfile,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for user registration
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['customer', 'merchant'])
    .withMessage('Role must be customer or merchant'),
];

// Validation rules for user login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);

module.exports = router;
