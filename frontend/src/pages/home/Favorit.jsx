import React, { memo } from 'react';
import BookSection from '../../components/sections/BookSection';
import { SORT_TYPES } from '../../hooks/useBook';

const Favorit = memo(() => {
  return (
    <BookSection
      title="Buku Terfavorit"
      subtitle="Popular book collections curated for you"
      badgeText="Favorit"
      badgeColor="purple"
      sortType={SORT_TYPES.FAVORITE}
      showRating={true}
      rightLabel='Rating'
    />
  );
});

Favorit.displayName = 'Favorit';
export default Favorit;
