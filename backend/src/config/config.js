// backend/src/config/config.js
export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  
  mongodb: {
    uri: process.env.MONGODB_ATLAS_URI,
    dbName: process.env.MONGODB_DB_NAME || 'ai_home_organizer',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    options: {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 1000,
    }
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'ai-home-organizer'
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3: {
      bucket: process.env.S3_BUCKET_NAME,
      signedUrlExpiry: 3600 // 1 hour
    },
    rekognition: {
      minConfidence: 80
    }
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    maxRetries: 3
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};