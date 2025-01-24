import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, User, BookOpen } from 'react-feather';

const FormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  formConfig,
  apiConfig 
}) => {
  const [preview, setPreview] = useState('');
  const [formData, setFormData] = useState({});
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize form data with default empty strings or initial data values
      const initialFormData = formConfig.fields.reduce((acc, field) => {
        // Ensure a defined value, prioritizing initial data, then empty string
        acc[field.id] = initialData && initialData[field.id] !== undefined 
          ? initialData[field.id] 
          : (field.type === 'password' ? '' : '');
        return acc;
      }, {});

      // Special handling for password field when editing
      if (initialData) {
        initialFormData.password = ''; // Always reset password field
      }

      setFormData(initialFormData);

      // Handle image preview with API base URL
      if (initialData && formConfig.imageField) {
        const imageUrl = formConfig.type === 'book' 
          ? `${apiConfig.baseURL}${initialData.cover_img}`
          : `${apiConfig.baseURL}${initialData.profile_img}`;
        setPreview(imageUrl);
      }
    }
  }, [isOpen, initialData, formConfig, apiConfig]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAlert({
          type: 'error',
          message: 'Ukuran gambar tidak boleh melebihi 2MB'
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setAlert({
          type: 'error',
          message: 'Hanya file JPG, JPEG & PNG yang diizinkan'
        });
        return;
      }
      setAlert(null);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '') {
        formDataObj.append(key, value);
      }
    });

    const imageFile = e.target[formConfig.imageField]?.files[0];
    if (imageFile) {
      formDataObj.append(formConfig.imageField, imageFile);
    }

    try {
      await onSubmit(formDataObj);
      setAlert({
        type: 'success',
        message: initialData ? `${formConfig.title} berhasil diperbarui!` : `${formConfig.title} berhasil ditambahkan!`
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f0a19] rounded-lg shadow-xl">
        <div className="sticky top-0 flex items-center justify-between p-6 bg-[#0f0a19] border-b border-gray-700">
          <h2 className="text-xl font-semibold">
            {initialData ? `Edit ${formConfig.title}` : `Tambah ${formConfig.title} Baru`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {alert && (
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
                alert.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
            >
              {alert.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span>{alert.message}</span>
              <button
                type="button"
                onClick={() => setAlert(null)}
                className="ml-auto hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          )}

          <div className="space-y-4">
            {formConfig.imageField && (
              <div className="flex flex-col gap-2">
                <label className="font-medium"> {formConfig.type === 'book' ? 'Foto Sampul' : 'Foto Profil'}</label>
                <div className="flex items-start gap-4">
                  <div className="w-32 h-40 bg-gray-800 rounded-lg overflow-hidden">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {formConfig.type === 'book' ? <BookOpen /> : <User />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id={formConfig.imageField}
                      name={formConfig.imageField}
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageChange}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                    />
                    <p className="mt-2 text-sm text-gray-400">
                      Format yang diizinkan: JPG, JPEG, PNG. Ukuran maksimal: 2MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {formConfig.fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <label htmlFor={field.id} className="font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.component ? (
                    field.component({
                      value: formData[field.id],
                      onChange: (e) => setFormData({ 
                        ...formData, 
                        [field.id]: e.target.value 
                      }),
                      options: field.options
                    })
                  ) : (
                    <input
                      type={field.type || 'text'}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        [field.id]: e.target.value 
                      })}
                      required={field.required}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
            >
              {initialData ? `Perbarui ${formConfig.title}` : `Tambah ${formConfig.title}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;