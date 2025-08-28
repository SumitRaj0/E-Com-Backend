const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/utils/errors');

const app = express();

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(limiter);
app.use(morgan('combined'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Test route for error handling
app.get('/test-error', (req, res, next) => {
  next(new Error('This is a test error'));
});

app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
