// backend/src/models/Project.js
import mongoose from 'mongoose';

const roomLayoutSchema = new mongoose.Schema({
  walls: [[Number]], // Polygon coordinates
  windows: [{
    position: { x: Number, y: Number },
    dimensions: { width: Number, height: Number }
  }],
  doors: [{
    position: { x: Number, y: Number },
    dimensions: { width: Number, height: Number },
    type: { type: String, enum: ['entry', 'closet', 'bathroom'] }
  }],
  dimensions: {
    width: Number,
    height: Number,
    unit: { type: String, default: 'feet' }
  },
  orientation: {
    type: String,
    enum: ['north', 'south', 'east', 'west']
  }
});

const clutterZoneSchema = new mongoose.Schema({
  area: [Number], // [x1, y1, x2, y2]
  intensity: { type: Number, min: 1, max: 10 },
  type: { 
    type: String, 
    enum: ['floor', 'shelf', 'counter', 'desk', 'closet', 'other'] 
  },
  objects: [String], // Types of objects in this zone
  priority: { type: Number, min: 1, max: 5, default: 3 }
});

const furniturePlacementSchema = new mongoose.Schema({
  objectId: String,
  type: String,
  position: { 
    x: Number, 
    y: Number, 
    z: Number 
  },
  dimensions: {
    width: Number,
    depth: Number,
    height: Number
  },
  orientation: Number, // Degrees
  confidence: Number
});

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  roomType: {
    type: String,
    required: true,
    enum: [
      'living-room', 'bedroom', 'kitchen', 'bathroom', 
      'office', 'garage', 'dining-room', 'kids-room',
      'closet', 'balcony', 'entryway'
    ]
  },
  description: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['draft', 'processing', 'analyzing', 'recommending', 'completed', 'failed'],
    default: 'draft'
  },
  images: [{
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image'
    },
    order: Number,
    angle: {
      type: String,
      enum: ['front', 'left', 'right', 'top', 'corner', 'overview']
    },
    isPrimary: Boolean
  }],
  settings: {
    faceBlur: { type: Boolean, default: true },
    privacyLevel: {
      type: String,
      enum: ['private', 'shared', 'public'],
      default: 'private'
    },
    analysisDepth: {
      type: String,
      enum: ['basic', 'detailed', 'comprehensive'],
      default: 'detailed'
    },
    budget: {
      type: String,
      enum: ['low', 'medium', 'high', 'premium'],
      default: 'medium'
    },
    stylePreference: {
      type: String,
      enum: ['modern', 'minimalist', 'rustic', 'industrial', 'scandinavian', 'traditional'],
      default: 'modern'
    }
  },
  aiAnalysis: {
    layout: roomLayoutSchema,
    clutterZones: [clutterZoneSchema],
    furniturePlacement: [furniturePlacementSchema],
    objectSummary: {
      furniture: [String],
      clutter: [String],
      decor: [String],
      storage: [String]
    },
    spaceUtilization: {
      used: Number, // Percentage
      available: Number,
      efficiency: { type: Number, min: 0, max: 100 }
    },
    safetyIssues: [{
      type: String,
      description: String,
      severity: { type: String, enum: ['low', 'medium', 'high'] }
    }],
    analyzedAt: Date
  },
  processingStats: {
    startedAt: Date,
    completedAt: Date,
    totalImages: Number,
    processedImages: Number,
    analysisTime: Number, // milliseconds
    errorCount: Number
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ status: 1, 'processingStats.startedAt': 1 });
projectSchema.index({ roomType: 1, 'aiAnalysis.spaceUtilization.efficiency': -1 });
projectSchema.index({ tags: 1 });

// Virtual for progress percentage
projectSchema.virtual('progress').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'failed') return 0;
  
  const statusWeights = {
    draft: 0,
    processing: 25,
    analyzing: 60,
    recommending: 85,
    completed: 100
  };
  
  return statusWeights[this.status] || 0;
});

export default mongoose.model('Project', projectSchema);