import React, { useEffect, lazy, Suspense, memo } from 'react';
import { useInView } from 'react-intersection-observer';
import Typewriter from 'typewriter-effect/dist/core';
import '../../App.css';

// Lazy load components with dynamic imports
const Hero = lazy(() => import('./Hero'));
const BookSection = lazy(() => import('../../components/modules/books/BookSection'));
const Penulis = lazy(() => import('./Penulis'));
const Ranking = lazy(() => import('./Ranking'));

// Loading
const LoadingFallback = memo(() => (
  <div className="w-full h-96 animate-pulse">
    <div className="w-full h-full bg-gray-800/50 rounded-2xl"></div>
  </div>
));


const LazyComponent = memo(({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      ) : (
        <LoadingFallback />
      )}
    </div>
  );
});

const Home = memo(() => {
  useEffect(() => {
    const initTypewriter = () => {
      const target = document.getElementById("dynamic-text");
      if (!target) return;

      return new Typewriter(target, {
        loop: true,
        delay: 85,
        deleteSpeed: 35,
        cursor: "|",
        strings: ["buku favoritmu", "genre favoritmu", "penulis idolamu"],
        pauseFor: 2000,
        autoStart: true,
      });
    };

    // Initialize typewriter with a small delay
    const timeoutId = setTimeout(initTypewriter, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <main>
      <LazyComponent>
        <Hero />
      </LazyComponent>
      
      <LazyComponent>
        <BookSection 
          title="Sedang Trending"
          subtitle="Popular book collections curated for you"
          badgeText="Trending"
          badgeColor="red"
          sortBy="peminjam"
          showRating={false}
        />
      </LazyComponent>
      
      <LazyComponent>
        <BookSection 
          title="Buku Terfavorit"
          subtitle="Popular book collections curated for you"
          badgeText="Favorit"
          badgeColor="purple"
          sortBy="rating"
          showRating={true}
        />
      </LazyComponent>
      
      <LazyComponent>
        <Penulis />
      </LazyComponent>
      
      <LazyComponent>
        <Ranking />
      </LazyComponent>
    </main>
  );
});

Home.displayName = 'Home';
LoadingFallback.displayName = 'LoadingFallback';
LazyComponent.displayName = 'LazyComponent';

export default Home;