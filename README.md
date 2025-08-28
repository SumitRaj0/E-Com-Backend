# E-Commerce Backend

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8080
MONGO_URI=mongodb+srv://5umit:RnRvSoBGSxJ1LsLL@5umit.ziksdbl.mongodb.net/?retryWrites=true&w=majority&appName=5umit
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES=7d
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Health Check

- `GET /health` - Server health status
- `GET /test-error` - Test error handling

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products

- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Add new product (merchant only)
- `PUT /api/products/:id` - Edit product (owner merchant only)
- `DELETE /api/products/:id` - Delete product (owner merchant only)
- `GET /api/products/merchant/my-products` - Get merchant's products (merchant only)
- `GET /api/products/merchant/stats` - Get product statistics (merchant only)
- `GET /api/products/filter-options` - Get available filter options

### Image Upload (Optional - requires Cloudinary)

- `POST /api/upload/single` - Upload single image (merchant only)
- `POST /api/upload/multiple` - Upload multiple images (merchant only)
- `DELETE /api/upload/delete` - Delete image from Cloudinary (merchant only)

## Features Implemented

Day 1-2 Complete:

- Backend project setup with npm
- All dependencies installed (express, mongoose, cors, dotenv, jsonwebtoken, bcryptjs)
- MongoDB Atlas connection configured
- User model with name, email, passwordHash, role, location
- Register route with password hashing
- Login route with JWT token generation
- Auth middleware for route protection
- Global error handling system
- Custom error classes
- Async error wrapper
- Input validation
- Security middleware (helmet, rate limiting, CORS)

Day 3-5 Complete:

- Category model with name and subcategories
- Product model with title, description, price, category, subcategory, location, merchant
- Merchant CRUD operations for products (add, edit, delete)
- Public product viewing APIs
- Advanced filtering, search, and sorting
- Pagination support
- Repository and Service layer architecture
- Image upload support with Cloudinary (optional)
- Enhanced error handling middleware

## Error Handling

The application uses a centralized error handling system:

- **Custom Error Classes**: AppError, ValidationError, AuthenticationError, etc.
- **Global Error Handler**: Catches all errors and formats responses consistently
- **Async Error Wrapper**: Automatically catches async errors
- **Structured Error Responses**: Consistent error format across all endpoints

## Architecture

The application follows a layered architecture pattern:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and orchestrate operations
- **Repositories**: Handle data access and database operations
- **Models**: Define data schemas and validation
- **Middleware**: Handle cross-cutting concerns (auth, validation, etc.)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation and sanitization
