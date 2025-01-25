import React from 'react';
import { BookOpen, User } from 'react-feather';
import { API_CONFIG } from '../../../config/api.config';
import RoleBadge from './RoleBadge';

const DetailModal = ({ data, isOpen, onClose, config = {} }) => {
  if (!isOpen || !data) return null;

  const {
    title: modalTitle = 'Detail',
    imageField = null,
    defaultIcon: DefaultIcon = BookOpen,
    sections = [],
    gridColumns = 2
  } = config;

  const renderImage = () => {
    if (!imageField || !data[imageField]) {
      return <DefaultIcon className="w-full h-full text-gray-600" />;
    }
    return (
      <img
        src={`${API_CONFIG.baseURL}${data[imageField]}`}
        alt={modalTitle}
        className="w-full h-full object-cover rounded-lg"
      />
    );
  };

  const renderSectionContent = (section) => {
    if (section.render) {
      return section.render(data);
    }

    if (section.fields) {
      return section.fields.map((field, index) => (
        <div key={index}>
          <p className="text-gray-400">{field.label}</p>
          <p className="font-semibold">{field.format ? field.format(data[field.key]) : data[field.key] || 'N/A'}</p>
        </div>
      ));
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div className="bg-[#2a2435] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {/* Image and Primary Info Section */}
          <div className="flex items-start mb-6">
            <div className="w-32 h-48 mr-6 flex-shrink-0">{renderImage()}</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{data[config.primaryTextField] || modalTitle}</h2>
              {config.secondaryFields?.map((field, index) => (
                <p key={index} className="text-gray-400 mb-1">
                  {field.label}: {data[field.key]}
                </p>
              ))}
            </div>
          </div>

          {/* Dynamic Sections */}
          {sections.map((section, index) => (
            <div key={index} className="mb-6">
              {section.title && <h3 className="text-lg font-semibold mb-2">{section.title}</h3>}
              <div className={`grid grid-cols-${gridColumns} gap-4`}>
                {section.fields?.map((field, fieldIndex) => (
                  <div key={fieldIndex}>
                    <p className="text-gray-400 mb-2">{field.label}</p>
                    {field.key === 'role' ? (
                      <RoleBadge role={data[field.key]} />
                    ) : (
                      <p className="font-semibold">{field.format ? field.format(data[field.key]) : data[field.key] || 'N/A'}</p>
                    )}
                  </div>
                ))}
                {section.render && section.render(data)}
              </div>
            </div>
          ))}

          <button onClick={onClose} className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;