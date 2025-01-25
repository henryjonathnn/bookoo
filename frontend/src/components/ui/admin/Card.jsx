import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        bg-[#1a1625] 
        rounded-xl 
        border 
        border-slate-700 
        overflow-hidden 
        shadow-lg 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        px-6 
        py-4 
        border-b 
        border-slate-700 
        flex 
        justify-between 
        items-center 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 
      className={`
        text-lg 
        font-semibold 
        text-white 
        ${className}
      `}
    >
      {children}
    </h3>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        p-6 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent };