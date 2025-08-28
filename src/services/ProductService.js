const ProductRepository = require('../repositories/ProductRepository');
const {
  ValidationError,
  NotFoundError,
  AuthorizationError,
} = require('../utils/errors');

class ProductService {
  // Add new product
  async addProduct(productData, merchantId) {
    const { category } = productData;

    // Validate category is not empty
    if (!category || category.trim() === '') {
      throw new ValidationError('Category is required');
    }

    const product = await ProductRepository.create({
      ...productData,
      merchant: merchantId,
    });

    await product.populate('merchant', 'name email');

    return product;
  }

  // Edit product
  async editProduct(productId, updateData, merchantId) {
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Check if user owns this product
    if (product.merchant.toString() !== merchantId.toString()) {
      throw new AuthorizationError('You can only edit your own products');
    }

    const { category } = updateData;

    // Validate category if provided
    if (category && category.trim() === '') {
      throw new ValidationError('Category cannot be empty');
    }

    const updatedProduct = await ProductRepository.updateById(
      productId,
      updateData
    );

    return updatedProduct;
  }

  // Delete product
  async deleteProduct(productId, merchantId) {
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Check if user owns this product
    if (product.merchant.toString() !== merchantId.toString()) {
      throw new AuthorizationError('You can only delete your own products');
    }

    await ProductRepository.deleteById(productId);
    return true;
  }

  // Get all products with filters
  async getAllProducts(filters) {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      q,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const query = { isActive: true };

    // Build query filters
    this.buildProductQuery(query, {
      category,
      minPrice,
      maxPrice,
      q,
    });

    // Build sort options
    const sort = this.buildSortOptions(sortBy, sortOrder);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [{ path: 'merchant', select: 'name' }],
      sort,
    };

    // Debug logging
    // console.log('Product Query:', JSON.stringify(query, null, 2));
    // console.log('Sort Options:', JSON.stringify(sort, null, 2));
    // console.log('Filters Applied:', { category, minPrice, maxPrice, q, sortBy, sortOrder });

    const products = await ProductRepository.findWithPagination(query, options);

    return {
      products: products.docs,
      pagination: {
        page: products.page,
        totalPages: products.totalPages,
        totalDocs: products.totalDocs,
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage,
        limit: products.limit,
      },
      filters: {
        category,
        minPrice,
        maxPrice,
        searchQuery: q,
        sortBy,
        sortOrder,
      },
    };
  }

  // Get product by ID
  async getProductById(productId) {
    const product = await ProductRepository.findByIdWithPopulate(productId, [
      { path: 'merchant', select: 'name email' },
    ]);

    if (!product || !product.isActive) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }

  // Get merchant products
  async getMerchantProducts(merchantId, filters) {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      q,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const query = { merchant: merchantId };

    // Build query filters
    this.buildProductQuery(query, {
      category,
      minPrice,
      maxPrice,
      q,
    });

    // Build sort options
    const sort = this.buildSortOptions(sortBy, sortOrder);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
    };

    const products = await ProductRepository.findWithPagination(query, options);

    return {
      products: products.docs,
      pagination: {
        page: products.page,
        totalPages: products.totalPages,
        totalDocs: products.totalDocs,
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage,
        limit: products.limit,
      },
      filters: {
        category,
        minPrice,
        maxPrice,
        searchQuery: q,
        sortBy,
        sortOrder,
      },
    };
  }

  // Build product query filters
  buildProductQuery(query, filters) {
    const { category, minPrice, maxPrice, q } = filters;

    // Category filter
    if (category && category.trim() !== '') {
      query.category = category;
    }

    // Price range filter - fix the logic
    if (
      minPrice !== undefined &&
      minPrice !== '' &&
      maxPrice !== undefined &&
      maxPrice !== ''
    ) {
      // Both min and max price are set
      query.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    } else if (minPrice !== undefined && minPrice !== '') {
      // Only min price is set
      query.price = { $gte: Number(minPrice) };
    } else if (maxPrice !== undefined && maxPrice !== '') {
      // Only max price is set
      query.price = { $lte: Number(maxPrice) };
    }

    // Text search filter - improve the logic
    if (q && q.trim() !== '') {
      // Use regex for more flexible text search
      query.$or = [
        { title: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
        { category: { $regex: q.trim(), $options: 'i' } },
      ];
    }
  }

  // Build sort options
  buildSortOptions(sortBy, sortOrder) {
    const sortOrderValue = sortOrder === 'asc' ? 1 : -1;

    // Validate and sanitize sortBy parameter
    const validSortFields = ['price', 'title', 'createdAt', 'updatedAt'];
    const sanitizedSortBy = validSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    switch (sanitizedSortBy) {
      case 'price':
        return { price: sortOrderValue };
      case 'title':
        return { title: sortOrderValue };
      case 'updatedAt':
        return { updatedAt: sortOrderValue };
      case 'createdAt':
      default:
        return { createdAt: sortOrderValue };
    }
  }
}

module.exports = new ProductService();
