// frontend/src/components/AdvancedImageUpload.jsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  AlertCircle,
  Camera,
  RotateCcw
} from 'lucide-react';

const AdvancedImageUpload = ({ 
  onUpload, 
  projectId, 
  maxFiles = 10, 
  allowedAngles = ['front', 'left', 'right', 'corner', 'overview'] 
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [angleSelection, setAngleSelection] = useState({});

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    if (acceptedFiles.length > 0) {
      setUploading(true);
      
      const newUploads = acceptedFiles.map(file => ({
        id: `${file.name}-${Date.now()}`,
        file,
        angle: angleSelection[file.name] || 'front',
        status: 'pending',
        progress: 0,
        error: null
      }));

      setUploadQueue(prev => [...prev, ...newUploads]);

      // Process uploads sequentially
      for (const upload of newUploads) {
        try {
          setUploadQueue(prev => prev.map(u => 
            u.id === upload.id ? { ...u, status: 'uploading' } : u
          ));

          // Simulate progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setUploadQueue(prev => prev.map(u => 
              u.id === upload.id ? { ...u, progress } : u
            ));
          }

          const result = await onUpload(upload.file, projectId, upload.angle);
          
          setUploadQueue(prev => prev.map(u => 
            u.id === upload.id ? { ...u, status: 'completed', result } : u
          ));
        } catch (error) {
          setUploadQueue(prev => prev.map(u => 
            u.id === upload.id ? { ...u, status: 'failed', error: error.message } : u
          ));
        }
      }

      setUploading(false);
    }
  }, [onUpload, projectId, angleSelection]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxFiles,
    maxSize: 15 * 1024 * 1024, // 15MB
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    disabled: uploading
  });

  const removeFromQueue = (uploadId) => {
    setUploadQueue(prev => prev.filter(u => u.id !== uploadId));
  };

  const retryUpload = async (upload) => {
    setUploadQueue(prev => prev.map(u => 
      u.id === upload.id ? { ...u, status: 'pending', error: null } : u
    ));
    
    // Re-process the upload
    onDrop([upload.file], []);
  };

  const updateAngle = (fileName, angle) => {
    setAngleSelection(prev => ({ ...prev, [fileName]: angle }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'uploading': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'uploading': return <Camera className="h-4 w-4 animate-pulse" />;
      default: return <ImageIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer 
          transition-all duration-300 ease-out
          ${isDragActive ? 'border-blue-400 bg-blue-50 scale-105 shadow-lg' : 'border-gray-300'}
          ${isDragReject ? 'border-red-400 bg-red-50' : ''}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50'}
        `}
      >
        <input {...getInputProps()} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-center">
            <div className="relative">
              <Upload className="h-16 w-16 text-gray-400" />
              {isDragActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 bg-blue-100 rounded-full animate-ping"
                />
              )}
            </div>
          </div>
          
          <div>
            <p className="text-xl font-bold text-gray-800">
              {isDragActive ? 'Drop to analyze your room' : 'Upload room photos'}
            </p>
            <p className="text-gray-600 mt-2">
              Take photos from different angles for best results
            </p>
            <div className="flex justify-center mt-3 space-x-2">
              {allowedAngles.map(angle => (
                <span key={angle} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                  {angle}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upload Queue */}
      <AnimatePresence>
        {uploadQueue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="text-lg font-semibold text-gray-800">Upload Queue</h4>
            
            {uploadQueue.map((upload) => (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 border-2 rounded-xl ${getStatusColor(upload.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {getStatusIcon(upload.status)}
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{upload.file.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <select
                          value={upload.angle}
                          onChange={(e) => updateAngle(upload.file.name, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                          disabled={upload.status === 'uploading'}
                        >
                          {allowedAngles.map(angle => (
                            <option key={angle} value={angle}>
                              {angle} view
                            </option>
                          ))}
                        </select>
                        
                        {upload.status === 'uploading' && (
                          <div className="w-20 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${upload.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {upload.status === 'failed' && (
                      <button
                        onClick={() => retryUpload(upload)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Retry upload"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => removeFromQueue(upload.id)}
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Remove from queue"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {upload.error && (
                  <p className="text-xs text-red-600 mt-2">{upload.error}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4"
      >
        <h5 className="font-semibold text-blue-800 mb-2">📸 Photo Tips for Best Results</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Take photos from chest height for natural perspective</li>
          <li>• Include all corners of the room in different shots</li>
          <li>• Ensure good lighting without harsh shadows</li>
          <li>• Keep camera steady to avoid blur</li>
          <li>• Capture closets and storage areas separately</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default AdvancedImageUpload;