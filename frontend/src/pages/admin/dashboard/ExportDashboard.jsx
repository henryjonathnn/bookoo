import React, { useState } from 'react';
import { Download, Calendar } from 'react-feather';
import DatePicker from '../../../components/ui/admin/DatePicker';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportDashboard = ({ peminjaman, books, users }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportType, setExportType] = useState('today');
  const [customRange, setCustomRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Dapatkan tahun-tahun yang tersedia dari data peminjaman
  const availableYears = [...new Set(peminjaman.map(p => 
    new Date(p.createdAt).getFullYear()
  ))].sort((a, b) => b - a);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Set range tanggal berdasarkan tipe ekspor
    let startDate, endDate;
    const now = new Date();
    
    switch (exportType) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'week':
        endDate = now;
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(selectedYear, selectedMonth, 1);
        endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);
        break;
      case 'custom':
        startDate = new Date(customRange.startDate);
        endDate = new Date(customRange.endDate);
        endDate.setHours(23, 59, 59);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = now;
    }

    // Filter data berdasarkan range
    const filteredData = peminjaman.filter(p => {
      const date = new Date(p.createdAt);
      return date >= startDate && date <= endDate;
    });

    // Header
    doc.setFontSize(20);
    doc.text('Laporan Peminjaman Buku', pageWidth / 2, 15, { align: 'center' });
    
    // Periode
    doc.setFontSize(12);
    doc.text(`Periode: ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}`, pageWidth / 2, 25, { align: 'center' });

    // Statistik
    const stats = {
      total: filteredData.length,
      pending: filteredData.filter(p => p.status === 'PENDING').length,
      dipinjam: filteredData.filter(p => p.status === 'DIPINJAM').length,
      dikembalikan: filteredData.filter(p => p.status === 'DIKEMBALIKAN').length,
      terlambat: filteredData.filter(p => p.status === 'TERLAMBAT').length
    };

    // Tabel Statistik
    doc.autoTable({
      startY: 35,
      head: [['Status', 'Jumlah']],
      body: [
        ['Total Peminjaman', stats.total],
        ['Pending', stats.pending],
        ['Dipinjam', stats.dipinjam],
        ['Dikembalikan', stats.dikembalikan],
        ['Terlambat', stats.terlambat]
      ],
      headStyles: { fillColor: [89, 92, 246] },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    // Detail Peminjaman dengan data user yang benar
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Tanggal', 'Judul Buku', 'Peminjam', 'Status']],
      body: filteredData.map(p => {
        const book = books.find(b => b.id === p.id_buku);
        const user = users.find(u => u.id === p.id_user);
        return [
          new Date(p.createdAt).toLocaleDateString('id-ID'),
          book?.judul || 'Unknown',
          user?.name || 'Unknown',
          p.status
        ];
      }),
      headStyles: { fillColor: [89, 92, 246] },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    // Simpan PDF
    const fileName = `laporan_peminjaman_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
      >
        <Download size={20} />
        Export Data
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#2a2438] rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-lg font-medium mb-4">Export Laporan</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Periode</label>
              <select 
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="bg-[#1a1625] border border-gray-700 rounded-lg px-3 py-2"
              >
                <option value="today">Hari Ini</option>
                <option value="week">Minggu Ini</option>
                <option value="month">Bulanan</option>
                <option value="custom">Kustom</option>
              </select>
            </div>

            {exportType === 'month' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-gray-400">Bulan</label>
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full bg-[#1a1625] border border-gray-700 rounded-lg px-3 py-2"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(2000, i).toLocaleDateString('id-ID', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Tahun</label>
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full bg-[#1a1625] border border-gray-700 rounded-lg px-3 py-2"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {exportType === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-gray-400">Tanggal Mulai</label>
                  <DatePicker
                    selectedDate={customRange.startDate}
                    onDateChange={(date) => setCustomRange(prev => ({ ...prev, startDate: date }))}
                    maxDate={customRange.endDate}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Tanggal Akhir</label>
                  <DatePicker
                    selectedDate={customRange.endDate}
                    onDateChange={(date) => setCustomRange(prev => ({ ...prev, endDate: date }))}
                    minDate={customRange.startDate}
                  />
                </div>
              </div>
            )}

            <button
              onClick={generatePDF}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDashboard; 