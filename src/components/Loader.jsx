"use client";

import React from 'react';

const Loader = ({ 
  size = 'md', 
  color = 'blue', 
  text = 'Loading...', 
  showText = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600',
    purple: 'border-purple-600',
    indigo: 'border-indigo-600'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          border-4 border-t-transparent 
          rounded-full 
          animate-spin
        `}
      />
      {showText && (
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );
};

// Full page loader component
export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <Loader size="lg" text={text} />
  </div>
);

// Inline loader component
export const InlineLoader = ({ text = 'Loading...', size = 'sm' }) => (
  <div className="flex items-center justify-center py-4">
    <Loader size={size} text={text} showText={false} />
    <span className="ml-2 text-sm text-gray-600">{text}</span>
  </div>
);

// Button loader component
export const ButtonLoader = ({ size = 'sm' }) => (
  <Loader size={size} showText={false} color="white" />
);

export default Loader;