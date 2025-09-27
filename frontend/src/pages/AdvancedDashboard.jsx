// frontend/src/pages/AdvancedDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Zap,
  BarChart3,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/projectStore';
import ProjectCard from '../components/ProjectCard';
import AnalyticsChart from '../components/AnalyticsChart';
import RealTimeStats from '../components/RealTimeStats';

const AdvancedDashboard = () => {
  const { projects, loading, fetchProjects } = useProjectStore();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    failed: 0,
    efficiency: 0
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (projects.length > 0) {
      const completed = projects.filter(p => p.status === 'completed').length;
      const processing = projects.filter(p => p.status === 'processing').length;
      const failed = projects.filter(p => p.status === 'failed').length;
      
      const efficiency = projects.reduce((acc, project) => 
        acc + (project.aiAnalysis?.spaceUtilization?.efficiency || 0), 0) / projects.length;

      setStats({
        total: projects.length,
        completed,
        processing,
        failed,
        efficiency: Math.round(efficiency)
      });
    }
  }, [projects]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Home Organizer
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Transform your space with intelligent organization solutions
          </p>
        </motion.div>

        {/* Real-time Stats */}
        <RealTimeStats stats={stats} />

        {/* Analytics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <AnalyticsChart projects={projects} />
          
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🚀 Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/projects/new"
                className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-3" />
                <span className="font-medium">New Room Analysis</span>
              </Link>
              
              <button className="flex items-center p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors w-full">
                <BarChart3 className="h-5 w-5 mr-3" />
                <span className="font-medium">View Analytics</span>
              </button>
              
              <button className="flex items-center p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors w-full">
                <Smartphone className="h-5 w-5 mr-3" />
                <span className="font-medium">Mobile App</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {projects.length} project{projects.length !== 1 ? 's' : ''}
              </span>
              <Link
                to="/projects/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Link>
            </div>
          </div>

          <AnimatePresence>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <ProjectCard 
                    key={project._id} 
                    project={project}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                  <Zap className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Ready to organize your space?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by analyzing a room with AI to get personalized organization recommendations
                  </p>
                  <Link
                    to="/projects/new"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Start Your First Project
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* AI Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">✨ AI-Powered Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-3 inline-block mb-3">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Space Analysis</h4>
              <p className="text-blue-100 text-sm">
                Intelligent measurement and space utilization optimization
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-3 inline-block mb-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Smart Recommendations</h4>
              <p className="text-blue-100 text-sm">
                Personalized storage solutions based on your style and budget
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-3 inline-block mb-3">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Real-time Progress</h4>
              <p className="text-blue-100 text-sm">
                Live updates and progress tracking for all your projects
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;