import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => {
  const spinnerClass = fullScreen ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50' : 'flex items-center justify-center py-12';

  return (
    <div className={spinnerClass} data-testid="loading-spinner">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-cyan-500 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
