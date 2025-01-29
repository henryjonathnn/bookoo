import React, { useState } from 'react';

const PenolakanModal = ({ isOpen, onClose, onSubmit }) => {
  const [alasan, setAlasan] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(alasan);
    setAlasan('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div 
        className="bg-[#1a1225] rounded-xl w-full max-w-md shadow-xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Alasan Penolakan</h3>
          <form onSubmit={handleSubmit}>
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-[#15101d] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Masukkan alasan penolakan..."
              required
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all"
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PenolakanModal; 