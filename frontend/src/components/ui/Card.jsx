import React from 'react';

export const Card = ({ className = '', children }) => {
  return (
    <div className={`bg-[#1A1A2E]/90 border border-purple-500/10 rounded-xl ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ className = '', children }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};