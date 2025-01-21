import React from 'react';
import { Plus } from 'react-feather';

const PageHeader = ({ title, subtitle, buttonLabel }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-gray-400">{subtitle}</p>
    </div>
    <button className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 transition-colors">
      <Plus size={20} />
      {buttonLabel}
    </button>
  </div>
);

export default PageHeader;