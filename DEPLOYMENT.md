# Vercel Deployment Guide

This guide will help you deploy your AI Home Organizer application to Vercel.

## 🚀 Deployment Steps

### 1. Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository connected to Vercel
- Node.js 18+ installed locally

### 2. Frontend Deployment

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: ai-human-organizer-frontend
# - Directory: ./
# - Override settings? N
```

#### Option B: Deploy via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Backend Deployment

#### Deploy Backend as Separate Vercel Project
```bash
# Navigate to backend directory
cd backend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: ai-human-organizer-backend
# - Directory: ./
# - Override settings? N
```

### 4. Environment Variables

#### Frontend Environment Variables
In Vercel dashboard, go to your frontend project settings and add:

```
VITE_API_URL=https://ai-human-organizer-backend.vercel.app
VITE_NODE_ENV=production
```

#### Backend Environment Variables
In Vercel dashboard, go to your backend project settings and add:

```
NODE_ENV=production
```

### 5. Update CORS Configuration

After deployment, update the backend CORS configuration with your actual Vercel URLs:

```javascript
// In backend/src/app.js
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://ai-human-organizer-frontend.vercel.app',
      'https://ai-human-organizer-git-main-shahidx345-shahid.vercel.app',
      'https://ai-human-organizer-shahidx345-shahid.vercel.app'
    ]
  : [
      'http://localhost:3002', 
      'http://localhost:3003', 
      'http://localhost:3004'
    ];
```

### 6. File Upload Configuration

For file uploads in production, consider using:
- **Vercel Blob Storage** for file storage
- **Cloudinary** for image management
- **AWS S3** for scalable storage

Update the backend to use cloud storage:

```javascript
// Example with Vercel Blob
import { put } from '@vercel/blob';

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const blob = await put(req.file.originalname, req.file.buffer, {
      access: 'public',
    });
    
    res.json({
      success: true,
      imageUrl: blob.url
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

## 🔧 Production Optimizations

### Frontend Optimizations
- ✅ Code splitting with dynamic imports
- ✅ Image optimization
- ✅ Bundle size optimization
- ✅ SEO meta tags
- ✅ PWA configuration

### Backend Optimizations
- ✅ Serverless function optimization
- ✅ Database connection pooling
- ✅ Caching strategies
- ✅ Error handling
- ✅ Logging and monitoring

## 📱 Custom Domain (Optional)

1. Go to your Vercel project settings
2. Go to "Domains" section
3. Add your custom domain
4. Update DNS records as instructed
5. Update CORS configuration with new domain

## 🔍 Monitoring and Analytics

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor performance and user behavior
- Track Core Web Vitals

### Error Monitoring
- Set up Sentry for error tracking
- Monitor API performance
- Track user sessions

## 🚀 Deployment URLs

After deployment, your application will be available at:

- **Frontend**: `https://ai-human-organizer-frontend.vercel.app`
- **Backend**: `https://ai-human-organizer-backend.vercel.app`

## 🔄 Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Automatic rollback on deployment failures

## 📋 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **CORS Issues**
   - Update allowed origins in backend
   - Check environment variables

3. **File Upload Issues**
   - Implement cloud storage
   - Check file size limits
   - Verify multer configuration

4. **Environment Variables**
   - Ensure all required env vars are set
   - Check variable naming (VITE_ prefix for frontend)

## 🎯 Performance Tips

1. **Frontend**
   - Use dynamic imports for code splitting
   - Optimize images with next/image
   - Implement lazy loading
   - Use CDN for static assets

2. **Backend**
   - Implement caching
   - Use connection pooling
   - Optimize database queries
   - Implement rate limiting

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review environment variables
3. Verify CORS configuration
4. Check network requests in browser dev tools

---

**Happy Deploying! 🚀**
