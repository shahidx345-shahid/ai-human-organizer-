// backend/src/config/database.js
import mongoose from 'mongoose';
import { config } from './config.js';

class Database {
  constructor() {
    this.connection = null;
    this.connect();
  }

  async connect() {
    try {
      if (this.connection) return this.connection;

      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        retryWrites: true,
        retryReads: true
      };

      this.connection = await mongoose.connect(config.mongodb.uri, options);
      
      console.log('✅ MongoDB Serverless connected successfully');
      
      await this.createIndexes();
      await this.createVectorSearchIndex();
      
      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  async createIndexes() {
    try {
      // User indexes
      await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
      await mongoose.connection.db.collection('users').createIndex({ createdAt: -1 });
      
      // Project indexes
      await mongoose.connection.db.collection('projects').createIndex({ userId: 1 });
      await mongoose.connection.db.collection('projects').createIndex({ 
        userId: 1, 
        status: 1,
        createdAt: -1 
      });
      
      // Image indexes
      await mongoose.connection.db.collection('images').createIndex({ projectId: 1 });
      await mongoose.connection.db.collection('images').createIndex({ 
        'aiAnalysis.status': 1,
        createdAt: 1 
      });
      
      // Product catalog indexes
      await mongoose.connection.db.collection('productcatalog').createIndex({ 
        category: 1,
        price: 1 
      });
      await mongoose.connection.db.collection('productcatalog').createIndex({ 
        tags: 1 
      });
      
      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Index creation error:', error);
    }
  }

  async createVectorSearchIndex() {
    try {
      // Create vector search index for product recommendations
      await mongoose.connection.db.collection('productcatalog').createIndex({
        embedding: "vector"
      }, {
        name: "product_vector_index",
        background: true,
        "vectorOptions": {
          "dimensions": 1536,
          "similarity": "cosine"
        }
      });
      
      console.log('✅ Vector search index created successfully');
    } catch (error) {
      console.warn('⚠️ Vector search index creation failed (might need manual setup):', error.message);
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      console.log('✅ MongoDB disconnected');
    }
  }
}

export default new Database();