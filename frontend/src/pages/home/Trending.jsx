import React, { memo } from 'react';
import BookSection from '../../components/modules/books/BookSection'
import { SORT_TYPES } from '../../hooks/useBook';

const Trending = memo(() => {
  return (
    <BookSection
      title="Sedang Trending"
      subtitle="Popular book collections curated for you"
      badgeText="Trending"
      badgeColor="red"
      sortType={SORT_TYPES.TRENDING}
      showRating={false}
      rightLabel="Peminjam"
    />
  );
});

Trending.displayName = 'Trending';
export default Trending;
