import React, { useState } from 'react';

const Tabs = ({ defaultValue, children, onValueChange }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (onValueChange) onValueChange(value);
  };

  return (
    <div className="tabs-container">
      <div className="tabs-list inline-flex h-10 items-center justify-center rounded-md bg-[#2a2438] p-1 text-gray-500">
        {React.Children.map(children, (child) => {
          if (child.type === TabsList) {
            return React.cloneElement(child, { 
              activeTab, 
              onTabChange: handleTabChange 
            });
          }
          return null;
        })}
      </div>
      {React.Children.map(children, (child) => {
        if (child.type === TabsContent && child.props.value === activeTab) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, onTabChange }) => {
  return React.Children.map(children, (child) => {
    if (child.type === TabsTrigger) {
      return React.cloneElement(child, { 
        isActive: child.props.value === activeTab,
        onClick: () => onTabChange(child.props.value)
      });
    }
    return null;
  });
};

const TabsTrigger = ({ children, value, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center whitespace-nowrap 
        rounded-sm px-3 py-1.5 text-sm font-medium transition-all
        ${isActive 
          ? 'bg-purple-600 text-white shadow-sm' 
          : 'hover:bg-[#3a3438] text-gray-300'
        }
      `}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value }) => {
  return (
    <div 
      className="mt-4 p-4 bg-[#2a2438] rounded-md"
      data-value={value}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };