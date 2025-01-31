import React from 'react';

const LoadingSpinner = ({ className = "", size = "medium" }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-12 w-12",
    large: "h-16 w-16"
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className={`
        animate-spin 
        rounded-full 
        border-b-2 
        border-purple-600
        ${sizeClasses[size]}
        ${className}
      `}></div>
    </div>
  );
};

export default LoadingSpinner; 