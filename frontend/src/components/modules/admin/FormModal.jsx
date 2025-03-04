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
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset form ketika modal dibuka untuk create baru
      const defaultValues = {};
      formConfig.fields.forEach(field => {
        if (field.type === 'number') {
          defaultValues[field.name] = field.min || 0;
        } else {
          defaultValues[field.name] = '';
        }
      });
      setFormData(defaultValues);
    }

    // Handle image preview
    if (initialData?.[formConfig.imageField]) {
      setPreview(`${apiConfig.baseURL}${initialData[formConfig.imageField]}`);
    } else {
      setPreview('');
    }
  }, [initialData, formConfig, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
    // Update formData with the file
    handleChange(formConfig.imageField, file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    const newErrors = {};
    formConfig.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} wajib diisi`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      setAlert({
        type: 'success',
        message: `${formConfig.title} berhasil ${initialData ? 'diperbarui' : 'ditambahkan'}!`
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Form submit error:', error);
      setErrors({ submit: error.message });
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
                alert.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
              }`}
            >
              {alert.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span>{alert.message}</span>
            </div>
          )}

          <div className="space-y-4">
            {formConfig.imageField && (
              <div className="flex flex-col gap-2">
                <label className="font-medium">
                  {formConfig.type === 'book' ? 'Foto Sampul' : 'Foto Profil'}
                </label>
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
                      onChange={handleImageChange}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                      accept="image/png, image/jpeg, image/jpg"
                    />
                    <p className="mt-2 text-sm text-gray-400">
                      Format yang diizinkan: JPG, JPEG, PNG. Ukuran maksimal: 2MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formConfig.fields.map((field) => (
              <div key={field.id} className="flex flex-col gap-2">
                <label htmlFor={field.id} className="font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.component ? (
                  field.component({
                    value: formData[field.id] || '',
                    onChange: (e) => handleChange(field.id, e.target.value),
                    options: field.options
                  })
                ) : (
                  <input
                    type={field.type || 'text'}
                    id={field.id}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    required={field.required}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                )}
              </div>
            ))}
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
              {initialData ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;