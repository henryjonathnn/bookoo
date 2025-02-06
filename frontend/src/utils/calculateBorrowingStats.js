export const calculateBorrowingStats = (historyPeminjaman) => {
    const totalPeminjaman = historyPeminjaman?.length || 0;
    const dikembalikan = historyPeminjaman?.filter(p => p.status === 'DIKEMBALIKAN').length || 0;
    const sedangBerjalan = historyPeminjaman?.filter(p => 
      ['PENDING', 'DIPROSES', 'DIKIRIM', 'DIPINJAM', 'TERLAMBAT'].includes(p.status)
    ).length || 0;
  
    return {
      totalPeminjaman,
      dikembalikan,
      sedangBerjalan
    };
  };