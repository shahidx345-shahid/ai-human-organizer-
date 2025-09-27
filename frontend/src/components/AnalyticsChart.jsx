import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Target,
  Zap
} from 'lucide-react';

const AnalyticsChart = ({ projects }) => {
  // Calculate analytics data
  const getAnalyticsData = () => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const recentProjects = projects.filter(p => 
      new Date(p.createdAt) >= last7Days
    );
    
    const statusCounts = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});
    
    const avgEfficiency = projects.length > 0 
      ? Math.round(projects.reduce((acc, p) => 
          acc + (p.aiAnalysis?.spaceUtilization?.efficiency || 0), 0) / projects.length
        )
      : 0;
    
    const completionRate = projects.length > 0 
      ? Math.round((statusCounts.completed || 0) / projects.length * 100)
      : 0;

    return {
      recentProjects: recentProjects.length,
      statusCounts,
      avgEfficiency,
      completionRate,
      totalProjects: projects.length
    };
  };

  const analytics = getAnalyticsData();

  const StatItem = ({ icon: Icon, label, value, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="text-center"
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${color} mb-3`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
          Analytics Overview
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          Last 7 days
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <StatItem
          icon={TrendingUp}
          label="Recent Projects"
          value={analytics.recentProjects}
          color="bg-blue-500"
          delay={0.1}
        />
        <StatItem
          icon={Target}
          label="Completion Rate"
          value={`${analytics.completionRate}%`}
          color="bg-green-500"
          delay={0.2}
        />
        <StatItem
          icon={Zap}
          label="Avg Efficiency"
          value={`${analytics.avgEfficiency}%`}
          color="bg-purple-500"
          delay={0.3}
        />
        <StatItem
          icon={BarChart3}
          label="Total Projects"
          value={analytics.totalProjects}
          color="bg-orange-500"
          delay={0.4}
        />
      </div>

      {/* Status Distribution */}
      <div className="border-t pt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Project Status Distribution</h4>
        <div className="space-y-3">
          {Object.entries(analytics.statusCounts).map(([status, count], index) => {
            const percentage = analytics.totalProjects > 0 
              ? Math.round((count / analytics.totalProjects) * 100)
              : 0;
            
            const getStatusColor = (status) => {
              switch (status) {
                case 'completed': return 'bg-green-500';
                case 'processing': return 'bg-blue-500';
                case 'failed': return 'bg-red-500';
                default: return 'bg-gray-500';
              }
            };

            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mr-3`} />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {status}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(status)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">
                    {count}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="border-t pt-6 mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">💡 Quick Insights</h4>
        <div className="space-y-2 text-sm text-gray-600">
          {analytics.completionRate > 70 && (
            <p className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Great completion rate! You're staying organized.
            </p>
          )}
          {analytics.avgEfficiency > 80 && (
            <p className="flex items-center">
              <span className="text-blue-500 mr-2">⚡</span>
              Excellent space utilization efficiency.
            </p>
          )}
          {analytics.recentProjects > 3 && (
            <p className="flex items-center">
              <span className="text-purple-500 mr-2">🔥</span>
              Active week! Keep up the momentum.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsChart;
