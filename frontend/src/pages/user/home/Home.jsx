import React, { Suspense, useEffect } from 'react';
import { SORT_TYPES } from '../../../constant/index';
import BookSection from '../../../components/modules/user/books/BookSection';
import Hero from './Hero'
import Penulis from './Penulis'
import Ranking from './Ranking'

const LoadingFallback = () => (
  <div className="w-full h-96 animate-pulse">
    <div className="w-full h-full bg-gray-800/50 rounded-2xl"></div>
  </div>
);

const Home = () => {
  useEffect(() => {
    const initTypewriter = async () => {
      const target = document.getElementById("dynamic-text");
      if (!target) return;

      try {
        const Typewriter = (await import('typewriter-effect/dist/core')).default;

        new Typewriter(target, {
          loop: true,
          delay: 85,
          deleteSpeed: 35,
          cursor: "|",
          strings: ["buku favoritmu", "genre favoritmu", "penulis idolamu"],
          pauseFor: 2000,
          autoStart: true,
        });
      } catch (error) {
        console.error('Error initializing typewriter:', error);
      }
    };

    const timeoutId = setTimeout(initTypewriter, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <main>
      <Suspense fallback={<LoadingFallback />}>
        <Hero />
        <BookSection
          title="Sedang Trending"
          subtitle="Top buku trending minggu ini"
          badgeText="Trending"
          badgeColor="red"
          sortType={SORT_TYPES.TRENDING}
          showRating={false}
          rightLabel="Peminjam"
        />
        <BookSection
          title="Buku Terfavorit"
          subtitle="Top buku terfavorit minggu ini"
          badgeText="Favorit"
          badgeColor="purple"
          sortType={SORT_TYPES.FAVORITE}
          showRating={true}
          rightLabel="Rating"
        />
        <Penulis />
        <Ranking />
      </Suspense>
    </main>
  );
};

export default Home;