# Deployment Guide

This guide covers deploying the E-Commerce backend to Render and Railway.

## Prerequisites

- GitHub repository with your code
- Render/Railway account
- MongoDB Atlas database (already configured)

## Deploy to Render

### 1. Connect GitHub Repository

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub account and select the repository
4. Choose the repository branch (usually `main` or `master`)

### 2. Configure Web Service

- **Name**: `ecommerce-backend` (or your preferred name)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or choose paid plan for production)

### 3. Environment Variables

Add these environment variables in Render:

```env
PORT=10000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES=7d
CORS_ORIGIN=https://your-frontend-domain.com
NODE_ENV=production

# Cloudinary configuration removed - no longer using image uploads
```

### 4. Deploy

Click "Create Web Service" and wait for deployment to complete.

## Deploy to Railway

### 1. Connect GitHub Repository

1. Go to [Railway Dashboard](https://railway.app/)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2. Configure Service

- **Service Type**: Web Service
- **Framework Preset**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Environment Variables

Add the same environment variables as above in Railway's Variables tab.

### 4. Deploy

Railway will automatically deploy your service.

## Update package.json for Production

Ensure your `package.json` has the correct start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Environment Variables for Production

### Required Variables

- `PORT`: Usually set by the platform (Render: 10000, Railway: auto)
- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Strong secret key for JWT tokens
- `JWT_EXPIRES`: Token expiration time
- `CORS_ORIGIN`: Your frontend domain
- `NODE_ENV`: Set to `production`

### Optional Variables

- No optional variables currently needed
# Cloudinary configuration removed - no longer using image uploads

## Testing Deployment

After deployment, test your endpoints:

1. **Health Check**: `GET https://your-app.onrender.com/health`
2. **Categories**: `GET https://your-app.onrender.com/api/categories`
3. **Products**: `GET https://your-app.onrender.com/api/products`

## Update Postman Collection

Update your Postman collection base URL to your deployed domain:

```json
{
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://your-app.onrender.com",
      "type": "string"
    }
  ]
}
```

## Monitoring and Logs

### Render

- View logs in the "Logs" tab
- Monitor performance in "Metrics" tab

### Railway

- View logs in the "Deployments" tab
- Monitor resource usage in "Metrics" tab

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs for dependency issues
   - Ensure all dependencies are in `package.json`

2. **Runtime Errors**
   - Check environment variables are set correctly
   - Verify MongoDB connection string

3. **CORS Issues**
   - Ensure `CORS_ORIGIN` is set to your frontend domain
   - Check if frontend is making requests to correct backend URL

### Debug Commands

```bash
# Check if server is running
curl https://your-app.onrender.com/health

# Check environment variables
echo $NODE_ENV
echo $MONGO_URI
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **JWT Secret**: Use a strong, unique secret in production
3. **CORS**: Restrict CORS origin to your frontend domain only
4. **Rate Limiting**: Already configured in the application
5. **Helmet**: Security headers are already configured

## Scaling

### Render

- Upgrade to paid plan for better performance
- Configure auto-scaling based on traffic

### Railway

- Configure resource limits
- Set up auto-scaling policies

## Backup and Recovery

1. **Database**: MongoDB Atlas provides automatic backups
2. **Code**: GitHub provides version control and backup
3. **Environment Variables**: Document all variables for recovery

## Next Steps

After successful deployment:

1. Test all API endpoints
2. Set up monitoring and alerts
3. Configure custom domain (optional)
4. Set up CI/CD pipeline
5. Prepare for frontend deployment
