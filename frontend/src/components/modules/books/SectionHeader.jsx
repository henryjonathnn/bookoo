import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

const SectionHeader = memo(({ 
  title, 
  subtitle, 
  badgeText, 
  badgeColor = 'purple',
  onViewAll 
}) => {
  const badgeColorClasses = {
    purple: 'bg-purple-500/20 text-purple-400',
    red: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <div className="flex items-center space-x-3">
          <h2 className="text-3xl font-bold">{title}</h2>
          <span className={`flex items-center space-x-1 px-3 py-1 rounded-full ${badgeColorClasses[badgeColor]} text-sm`}>
            <span className={`h-2 w-2 ${badgeColor === 'purple' ? 'bg-purple-400' : 'bg-red-400'} rounded-full animate-pulse`}></span>
            <span>{badgeText}</span>
          </span>
        </div>
        <p className="text-gray-400 mt-2">{subtitle}</p>
      </div>
      <div className="flex space-x-3">
        <button className="p-3 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10">
          <ChevronLeft size={20} />
        </button>
        <button className="p-3 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10">
          <ChevronRight size={20} />
        </button>
        <button
          onClick={onViewAll}
          className="px-4 py-2 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10 text-white"
        >
          Lihat Semua
        </button>
      </div>
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;