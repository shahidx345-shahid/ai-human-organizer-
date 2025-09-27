// frontend/src/components/RealTimeStats.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, change, color, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value > 0) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, delay * 100);
      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? displayValue.toLocaleString() : value}
          </p>
          {change && (
            <p className={`text-xs font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last week
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-100 rounded-full">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
      </div>
    </motion.div>
  );
};

const RealTimeStats = ({ stats }) => {
  const [liveUpdates, setLiveUpdates] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUpdates(prev => prev + 1);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
    >
      <StatCard
        icon={TrendingUp}
        label="Total Projects"
        value={stats.total}
        change={+12}
        color="border-l-blue-500"
        delay={0.1}
      />
      
      <StatCard
        icon={CheckCircle}
        label="Completed"
        value={stats.completed}
        change={+8}
        color="border-l-green-500"
        delay={0.2}
      />
      
      <StatCard
        icon={Clock}
        label="In Progress"
        value={stats.processing}
        change={+15}
        color="border-l-yellow-500"
        delay={0.3}
      />
      
      <StatCard
        icon={AlertCircle}
        label="Needs Attention"
        value={stats.failed}
        change={-5}
        color="border-l-red-500"
        delay={0.4}
      />
      
      <StatCard
        icon={Zap}
        label="Avg Efficiency"
        value={`${stats.efficiency}%`}
        change={+3}
        color="border-l-purple-500"
        delay={0.5}
      />

      {/* Live Updates Indicator */}
      <AnimatePresence>
        {liveUpdates > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
          >
            Live • {liveUpdates} updates
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RealTimeStats;