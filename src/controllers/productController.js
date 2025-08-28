const ProductService = require('../services/ProductService');
const { asyncHandler } = require('../utils/errors');

// Add new product (merchant only)
const addProduct = asyncHandler(async (req, res) => {
  const productData = req.body;
  const product = await ProductService.addProduct(productData, req.user._id);

  res.status(201).json({
    success: true,
    message: 'Product added successfully',
    product,
  });
});

// Edit product (owner merchant only)
const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedProduct = await ProductService.editProduct(
    id,
    updateData,
    req.user._id
  );

  res.json({
    success: true,
    message: 'Product updated successfully',
    product: updatedProduct,
  });
});

// Delete product (owner merchant only)
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await ProductService.deleteProduct(id, req.user._id);

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

// Get all products with advanced filtering, search, and sorting
const getAllProducts = asyncHandler(async (req, res) => {
  const result = await ProductService.getAllProducts(req.query);

  res.json({
    success: true,
    ...result,
  });
});

// Get product by ID (public)
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await ProductService.getProductById(id);

  res.json({
    success: true,
    product,
  });
});

// Get products by merchant (for merchant dashboard)
const getMerchantProducts = asyncHandler(async (req, res) => {
  const result = await ProductService.getMerchantProducts(
    req.user._id,
    req.query
  );

  res.json({
    success: true,
    ...result,
  });
});

module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getMerchantProducts,
};
