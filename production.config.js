// Production Configuration for AI Home Organizer
// This file contains production-ready configuration settings

export const productionConfig = {
  // Application URLs
  frontend: {
    url: 'https://ai-human-organizer-frontend.vercel.app',
    apiUrl: 'https://ai-human-organizer-backend.vercel.app'
  },
  
  backend: {
    url: 'https://ai-human-organizer-backend.vercel.app',
    port: process.env.PORT || 3001
  },

  // CORS Configuration
  cors: {
    allowedOrigins: [
      'https://ai-human-organizer-frontend.vercel.app',
      'https://ai-human-organizer-git-main-shahidx345-shahid.vercel.app',
      'https://ai-human-organizer-shahidx345-shahid.vercel.app'
    ],
    credentials: true
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    storagePath: 'uploads'
  },

  // Security Configuration
  security: {
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.vercel.com"]
        }
      }
    }
  },

  // Performance Configuration
  performance: {
    compression: true,
    cacheControl: {
      static: 'public, max-age=31536000',
      api: 'no-cache'
    }
  }
};

export default productionConfig;
