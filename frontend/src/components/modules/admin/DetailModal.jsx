import React from 'react';
import { BookOpen } from 'react-feather';
import { API_CONFIG } from '../../../config/api.config';

const DetailModal = ({ data, isOpen, onClose, config = {} }) => {
  if (!isOpen || !data) return null;

  const {
    title: modalTitle = 'Detail',
    imageField = null,
    defaultIcon: DefaultIcon = BookOpen,
    primaryTextField,
    secondaryFields = [],
    sections = []
  } = config;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div 
        className="bg-[#1a1225] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header dengan gradien */}
        <div className="bg-gradient-to-r from-violet-900 to-indigo-900 p-6 rounded-t-xl">
          <div className="flex items-center gap-4">
            <div className="w-20 h-28 bg-[#15101d] rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
              {imageField && data[imageField] ? (
                <img
                  src={`${API_CONFIG.baseURL}${data[imageField]}`}
                  alt={modalTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <DefaultIcon className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                {data[primaryTextField] || modalTitle}
              </h2>
              <div className="space-y-1">
                {secondaryFields?.map((field, index) => (
                  <p key={index} className="text-gray-300 text-sm">
                    {field.label}: <span className="font-medium text-white">{data[field.key]}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Body content dengan layout yang lebih baik */}
        <div className="p-6 space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-[#15101d] rounded-xl p-6 shadow-lg">
              {section.title && (
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  {section.title}
                </h3>
              )}
              
              {section.render ? (
                section.render(data)
              ) : (
                <div className={`grid ${section.title === 'Deskripsi' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
                  {section.fields?.map((field, fieldIndex) => (
                    <div key={fieldIndex} className={`${section.title === 'Deskripsi' ? 'col-span-full' : ''}`}>
                      <p className="text-gray-400 text-sm mb-1">{field.label}</p>
                      <p className="font-medium text-white">
                        {field.format ? field.format(data[field.key]) : data[field.key] || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer dengan tombol yang lebih menarik */}
        <div className="p-6 pt-0">
          <button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl transition-all hover:from-violet-700 hover:to-indigo-700 font-medium shadow-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;