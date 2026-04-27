import React from 'react';
import { Link } from 'react-router-dom';
export const EmptyDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl">restaurant</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No meals logged today</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        Start tracking your nutrition to see your daily progress, macros, and AI-powered insights.
      </p>
      <Link 
        to="/log" 
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center"
      >
        <span className="material-symbols-outlined mr-2">add</span>
        Log First Meal
      </Link>
    </div>
  );
};
