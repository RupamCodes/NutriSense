import React from 'react';
import { Link } from 'react-router-dom';
export const EmptyHabits = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl">task_alt</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Build Healthy Habits</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        Small daily actions lead to big results. Create your first habit to start building streaks!
      </p>
      <Link 
        to="/habits/new" 
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center"
      >
        <span className="material-symbols-outlined mr-2">add_task</span>
        Create First Habit
      </Link>
    </div>
  );
};
