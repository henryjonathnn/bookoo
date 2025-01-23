import React, { useState, useEffect } from 'react';
import { X } from 'react-feather';
import Alert from '../../ui/admin/Alert';

const BookFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const BOOK_CATEGORIES = [
        'FIKSI', 'NON-FIKSI', 'SAINS', 'TEKNOLOGI', 'SEJARAH', 'SASTRA', 'KOMIK', 'LAINNYA'
    ];
    const [preview, setPreview] = useState('');
    const [formData, setFormData] = useState({
        judul: '',
        penulis: '',
        isbn: '',
        kategori: '',
        deskripsi: '',
        stock: '',
        denda_harian: '',
        penerbit: '',
        tahun_terbit: '',
    });
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                judul: initialData?.judul || '',
                penulis: initialData?.penulis || '',
                isbn: initialData?.isbn || '',
                kategori: initialData?.kategori || '',
                deskripsi: initialData?.deskripsi || '',
                stock: initialData?.stock || '',
                denda_harian: initialData?.denda_harian || '',
                penerbit: initialData?.penerbit || '',
                tahun_terbit: initialData?.tahun_terbit || '',
            });
            setPreview(initialData?.cover_img || '');
        }
    }, [isOpen, initialData]);

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
                    message: 'Image size should be less than 2MB'
                });
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                setAlert({
                    type: 'error',
                    message: 'Only JPG, JPEG & PNG files are allowed'
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

        const imageFile = e.target.cover_img.files[0];
        if (imageFile) {
            formDataObj.append('cover_img', imageFile);
        }

        try {
            await onSubmit(formDataObj);
            setAlert({
                type: 'success',
                message: initialData ? 'Book updated successfully!' : 'Book created successfully!'
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
            <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-lg shadow-xl">
                <div className="sticky top-0 flex items-center justify-between p-6 bg-slate-900 border-b border-slate-700">
                    <h2 className="text-xl font-semibold">
                        {initialData ? 'Edit Book' : 'Add New Book'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {alert && (
                        <Alert
                            variant={alert.type}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    )}

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium">Cover Image</label>
                            <div className="flex items-start gap-4">
                                <div className="w-32 h-40 bg-slate-800 rounded-lg overflow-hidden">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                                            No image
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        id="cover_img"
                                        name="cover_img"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handleImageChange}
                                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                                    />
                                    <p className="mt-2 text-sm text-slate-400">
                                        Accepted formats: JPG, JPEG, PNG. Max size: 2MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {[
                            { id: 'judul', label: 'Title', required: true },
                            { id: 'penulis', label: 'Author', required: true },
                            { id: 'isbn', label: 'ISBN', required: true },
                            {
                                id: 'kategori',
                                label: 'Category',
                                required: true,
                                component: (
                                    <select
                                        id="kategori"
                                        name="kategori"
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Select Category</option>
                                        {BOOK_CATEGORIES.map(category => (
                                            <option key={category} value={category}>
                                                {category.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                )
                            },
                            { id: 'deskripsi', label: 'Description', required: false },
                            { id: 'stock', label: 'Stock', type: 'number', required: true },
                            { id: 'denda_harian', label: 'Daily Fine', type: 'number', required: true },
                            { id: 'penerbit', label: 'Publisher', required: true },
                            { id: 'tahun_terbit', label: 'Publication Year', required: true }
                        ].map(({ id, label, type = 'text', required, component }) => (
                            <div key={id} className="flex flex-col gap-2">
                                <label htmlFor={id} className="font-medium">
                                    {label}
                                    {required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {component || (
                                    <input
                                        type={type}
                                        id={id}
                                        name={id}
                                        value={formData[id]}
                                        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                                        required={required}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                        >
                            {initialData ? 'Update Book' : 'Create Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookFormModal;