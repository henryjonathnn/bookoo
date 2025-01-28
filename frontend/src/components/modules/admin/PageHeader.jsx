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
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm md:w-auto w-max"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{buttonLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;