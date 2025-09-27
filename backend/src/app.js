import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
// CORS configuration for development and production
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://ai-human-organizer.vercel.app',
      'https://ai-human-organizer-git-main-shahidx345-shahid.vercel.app',
      'https://ai-human-organizer-shahidx345-shahid.vercel.app'
    ]
  : [
      'http://localhost:3002', 
      'http://localhost:3003', 
      'http://localhost:3004', 
      'http://127.0.0.1:3002', 
      'http://127.0.0.1:3003', 
      'http://127.0.0.1:3004'
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Home Organizer API is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API Routes
app.get('/api/projects', (req, res) => {
  // Mock data for now - replace with database queries later
  const mockProjects = [
    {
      _id: '1',
      name: 'Living Room Organization',
      description: 'AI-powered living room optimization project',
      status: 'completed',
      createdAt: new Date().toISOString(),
      images: [],
      aiAnalysis: {
        spaceUtilization: { efficiency: 85 },
        overallScore: 92
      },
      progress: 100
    },
    {
      _id: '2',
      name: 'Kitchen Storage',
      description: 'Smart kitchen storage solutions',
      status: 'processing',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      images: [],
      aiAnalysis: {
        spaceUtilization: { efficiency: 0 },
        overallScore: 0
      },
      progress: 45
    },
    {
      _id: '3',
      name: 'Bedroom Closet',
      description: 'Master bedroom closet organization',
      status: 'pending',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      images: [],
      aiAnalysis: {
        spaceUtilization: { efficiency: 0 },
        overallScore: 0
      },
      progress: 0
    }
  ];
  
  res.json(mockProjects);
});

app.post('/api/projects', (req, res) => {
  const newProject = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    status: 'pending',
    progress: 0,
    aiAnalysis: {
      spaceUtilization: { efficiency: 0 },
      overallScore: 0
    }
  };
  
  res.status(201).json(newProject);
});

app.get('/api/projects/:id', (req, res) => {
  const projectId = req.params.id;
  // Mock single project response
  const project = {
    _id: projectId,
    name: 'Sample Project',
    description: 'AI-powered organization project',
    status: 'completed',
    createdAt: new Date().toISOString(),
    images: [],
    aiAnalysis: {
      spaceUtilization: { efficiency: 85 },
      overallScore: 92
    },
    progress: 100
  };
  
  res.json(project);
});

app.put('/api/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const updatedProject = {
    _id: projectId,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json(updatedProject);
});

app.delete('/api/projects/:id', (req, res) => {
  const projectId = req.params.id;
  res.status(204).send();
});

// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Multiple image upload endpoint
app.post('/api/upload/multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const uploadedImages = req.files.map(file => ({
      imageUrl: `http://localhost:${PORT}/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.json({
      success: true,
      images: uploadedImages,
      count: uploadedImages.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

const PORT = process.env.PORT || 3001;

// For Vercel deployment
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}