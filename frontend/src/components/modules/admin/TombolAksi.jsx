import React, { useState } from "react";
import { Eye, MoreVertical, PenTool, Trash2 } from "react-feather";
import { toast } from "react-hot-toast";

const TombolAksi = ({ 
  onView, 
  onEdit, 
  onDelete, 
  onRefresh, 
  userId, 
  bookId 
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDelete = async () => {
    try {
      if (onDelete) {
        const result = await onDelete();
        
        if (result && result.status) {
          toast.success(result.message || 'Berhasil menghapus item!');
          setShowConfirmModal(false);
          if (onRefresh) onRefresh();
        } else {
          toast.error('Gagal menghapus item');
        }
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || 'Terjadi kesalahan saat menghapus';
      toast.error('Gagal hapus item: ' + errorMessage);
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {onView && (
          <button 
            onClick={onView} 
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Eye size={18} className="text-gray-400" />
          </button>
        )}
        
        {onEdit && (
          <button 
            onClick={onEdit} 
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <PenTool size={18} className="text-gray-400" />
          </button>
        )}
        
        {onDelete && (
          <button 
            onClick={() => setShowConfirmModal(true)} 
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Trash2 size={18} className="text-gray-400" />
          </button>
        )}
        
        <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
          <MoreVertical size={18} className="text-gray-400" />
        </button>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-400 mb-6">Apakah Anda yakin ingin menghapus item ini?</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TombolAksi;