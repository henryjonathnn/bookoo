import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'md', 
  className = '' 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none';
  
  const variantStyles = {
    default: 'bg-purple-600 text-white hover:bg-purple-700',
    outline: 'border border-purple-500 text-purple-500 hover:bg-purple-500/10',
    ghost: 'text-gray-400 hover:bg-gray-700 hover:text-white'
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${baseStyles} 
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button ;