import React from 'react';

/**
 * LoadingSpinner component handles both traditional spinners and modern content skeleton screens.
 */
const LoadingSpinner = ({ type = 'spinner' }) => {
  // Option 1: Classic Spinner
  if (type === 'spinner') {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-slate-200 dark:border-slate-800"></div>
          <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-2 border-indigo-600 dark:border-indigo-400 animate-spin"></div>
        </div>
      </div>
    );
  }

  // Option 2: Skeleton Grid for Dashboard
  if (type === 'skeleton-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/5"></div>
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6"></div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-16"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Option 3: Skeleton Detail page
  if (type === 'skeleton-detail') {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 animate-pulse space-y-6">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-24"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6"></div>
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div className="space-y-1 w-24">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3"></div>
          </div>
        </div>
        <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-11/12"></div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSpinner;
