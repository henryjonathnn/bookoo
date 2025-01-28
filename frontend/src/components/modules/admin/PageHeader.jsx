import React from 'react';
import { PlusCircle } from 'react-feather';

const PageHeader = ({ title, subtitle, buttonLabel, onButtonClick }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        </div>
        {buttonLabel && (
          <button
            onClick={onButtonClick}
            className="flex items-center justify-center gap-1 px-2 py-1.5 md:px-4 md:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-[11px] md:text-sm md:w-auto w-max whitespace-nowrap"
          >
            <PlusCircle className="w-2.5 h-2.5 md:w-4 md:h-4" />
            <span>{buttonLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;