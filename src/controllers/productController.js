const { validationResult } = require('express-validator');
const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category, stock, images } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: images || [],
      merchant: req.user._id,
    });

    await product.populate('merchant', 'name email');

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const products = await Product.find(query)
      .populate('merchant', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true })
      .populate('merchant', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findOne({ _id: req.params.id, merchant: req.user._id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, category, stock, images } = req.body;
    
    Object.assign(product, { name, description, price, category, stock, images });
    await product.save();
    await product.populate('merchant', 'name email');

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, merchant: req.user._id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMerchantProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const products = await Product.find({ merchant: req.user._id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ merchant: req.user._id });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getMerchantProducts,
};