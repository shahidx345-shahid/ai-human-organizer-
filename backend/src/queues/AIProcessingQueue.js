// backend/src/queues/AIProcessingQueue.js
import { Queue, Worker } from 'bullmq';
import { redis } from '../config/redis.js';
import { AdvancedAIService } from '../services/AdvancedAIService.js';
import Image from '../models/Image.js';
import Project from '../models/Project.js';

class AIProcessingQueue {
  constructor() {
    this.queue = new Queue('ai-processing', { 
      connection: redis,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000
        }
      }
    });
    
    this.worker = new Worker('ai-processing', this.processJob.bind(this), {
      connection: redis,
      concurrency: 2 // Process 2 images simultaneously
    });
    
    this.setupEventHandlers();
  }

  async addImageProcessingJob(jobData) {
    return this.queue.add('process-image', jobData, {
      jobId: `image_${jobData.imageId}`,
      priority: jobData.priority || 1
    });
  }

  async processJob(job) {
    const { imageId, projectId, userId, s3Key, userPreferences } = job.data;
    
    try {
      // Update image status to processing
      await Image.findByIdAndUpdate(imageId, {
        'aiAnalysis.status': 'processing',
        'aiAnalysis.startedAt': new Date()
      });

      // Get image from S3
      const imageBuffer = await this.getImageFromS3(s3Key);
      
      // Process with AI
      const aiService = new AdvancedAIService();
      const analysisResults = await aiService.processRoomImage(
        imageBuffer, 
        { imageId, projectId, userId },
        userPreferences
      );

      // Save results
      await Image.findByIdAndUpdate(imageId, {
        'aiAnalysis': {
          ...analysisResults,
          status: 'completed',
          completedAt: new Date()
        }
      });

      // Update project progress
      await this.updateProjectProgress(projectId);

      // Emit real-time update
      this.emitProgressUpdate(projectId, 'image_processed', { imageId, analysisResults });

      return analysisResults;
    } catch (error) {
      // Mark as failed
      await Image.findByIdAndUpdate(imageId, {
        'aiAnalysis.status': 'failed',
        'aiAnalysis.error': error.message,
        'aiAnalysis.completedAt': new Date()
      });

      throw error;
    }
  }

  async updateProjectProgress(projectId) {
    const project = await Project.findById(projectId).populate('images.imageId');
    const images = project.images.map(img => img.imageId);
    
    const processedCount = images.filter(img => 
      img.aiAnalysis?.status === 'completed'
    ).length;
    
    const totalCount = images.length;
    const progress = totalCount > 0 ? (processedCount / totalCount) * 100 : 0;

    // Update project status based on progress
    let status = project.status;
    if (progress === 100) {
      status = 'analyzing';
    } else if (progress > 0) {
      status = 'processing';
    }

    await Project.findByIdAndUpdate(projectId, {
      status,
      'processingStats.processedImages': processedCount,
      'processingStats.totalImages': totalCount
    });

    return { progress, status };
  }

  setupEventHandlers() {
    this.worker.on('completed', (job) => {
      console.log(`✅ AI processing completed for job ${job.id}`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`❌ AI processing failed for job ${job.id}:`, err);
    });

    this.worker.on('progress', (job, progress) => {
      console.log(`📊 Job ${job.id} progress: ${progress}%`);
    });
  }

  emitProgressUpdate(projectId, event, data) {
    // This would integrate with WebSocket for real-time updates
    // For now, we'll log it
    console.log(`🔔 Progress update for project ${projectId}:`, event, data);
  }
}

export default new AIProcessingQueue();