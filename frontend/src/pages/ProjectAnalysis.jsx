import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download, 
  Share2,
  RotateCcw,
  Lightbulb,
  ShoppingCart,
  Ruler,
  Palette
} from 'lucide-react';

const ProjectAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          setAnalysis({
            id,
            projectName: "Master Bedroom Organization",
            roomType: "Bedroom",
            efficiency: 85,
            recommendations: [
              {
                id: 1,
                title: "Optimize Closet Space",
                description: "Install vertical storage solutions and drawer dividers to maximize closet efficiency",
                priority: "high",
                estimatedCost: "$150-300",
                timeToComplete: "2-3 hours",
                impact: "Increase storage by 40%"
              },
              {
                id: 2,
                title: "Under-Bed Storage",
                description: "Add rolling storage bins under the bed for seasonal items and extra linens",
                priority: "medium",
                estimatedCost: "$50-100",
                timeToComplete: "1 hour",
                impact: "Gain 12 cubic feet of storage"
              },
              {
                id: 3,
                title: "Nightstand Organization",
                description: "Add drawer dividers and charging station to keep nightstands clutter-free",
                priority: "low",
                estimatedCost: "$25-50",
                timeToComplete: "30 minutes",
                impact: "Improve daily routine efficiency"
              }
            ],
            shoppingList: [
              { item: "Closet organizers", quantity: 2, price: "$45", store: "IKEA" },
              { item: "Under-bed storage bins", quantity: 4, price: "$60", store: "Target" },
              { item: "Drawer dividers", quantity: 6, price: "$30", store: "Amazon" },
              { item: "Charging station", quantity: 1, price: "$25", store: "Best Buy" }
            ],
            spaceUtilization: {
              current: 65,
              potential: 85,
              improvement: 20
            },
            colorScheme: {
              primary: "#3B82F6",
              secondary: "#8B5CF6",
              accent: "#10B981"
            }
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [id]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Analysis in Progress</h2>
            <p className="text-gray-600 mb-6">
              Our AI is analyzing your space and generating personalized recommendations...
            </p>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processing photos...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Analyzing room layout and dimensions
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Identifying storage opportunities
              </div>
              <div className="flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                Generating recommendations...
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {analysis.projectName}
              </h1>
              <p className="text-gray-600 mt-2">
                AI-powered organization analysis complete
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Analysis Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Efficiency Score</h3>
              <Ruler className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{analysis.efficiency}%</div>
            <div className="text-sm text-gray-600">
              Current space utilization efficiency
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Improvement Potential</h3>
              <Lightbulb className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">+{analysis.spaceUtilization.improvement}%</div>
            <div className="text-sm text-gray-600">
              Potential efficiency increase
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recommendations</h3>
              <CheckCircle className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">{analysis.recommendations.length}</div>
            <div className="text-sm text-gray-600">
              Personalized suggestions
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Recommendations</h2>
          <div className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                        {getPriorityIcon(rec.priority)}
                        <span className="ml-1 capitalize">{rec.priority} Priority</span>
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{rec.title}</h3>
                    <p className="text-gray-600 mb-4">{rec.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600">Time: {rec.timeToComplete}</span>
                      </div>
                      <div className="flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600">Cost: {rec.estimatedCost}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600">Impact: {rec.impact}</span>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Shopping List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping List</h2>
          <div className="space-y-3">
            {analysis.shoppingList.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900">{item.item}</span>
                  <span className="ml-2 text-gray-500">x{item.quantity}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{item.store}</span>
                  <span className="font-semibold text-gray-900">{item.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-900">
              Total Estimated Cost: $160
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
              <ShoppingCart className="h-5 w-5 mr-2 inline" />
              Add to Cart
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectAnalysis;
