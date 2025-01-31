import React from 'react'
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const History = () => {
  const loading = false;

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {/* ... konten riwayat */}
        </div>
      )}
    </div>
  )
}

export default History