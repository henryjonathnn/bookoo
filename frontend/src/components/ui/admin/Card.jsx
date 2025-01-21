import React from 'react';

const Card = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`rounded-xl border bg-[#1a1625] border-slate-800 shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ className = '', children, ...props }) => {
  return (
    <h3
      className={`text-xl font-semibold leading-none tracking-tight text-white ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardContent = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`p-6 pt-0 mt-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent };