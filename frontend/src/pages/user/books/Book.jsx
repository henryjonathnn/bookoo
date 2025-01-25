import React, { useEffect, lazy, Suspense } from 'react';
import { memo } from 'react';
import Typewriter from 'typewriter-effect/dist/core';
import '../../../App.css'
import { SORT_TYPES } from '../../../constant';

// Lazy load components
const Hero = lazy(() => import('../home/Hero'));
const BookSection = lazy(() => import('../../../components/modules/user/books/BookSection'));
const Ranking = lazy(() => import('../home/Ranking'));

// Loading fallback component
const LoadingFallback = () => (
    <div className="w-full h-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
);

// Memoized Home component
const Book = memo(() => {
    useEffect(() => {
        // Debounced typewriter initialization
        let typewriterInstance = null;
        const initTypewriter = () => {
            const target = document.getElementById("dynamic-text");
            if (!target) return;

            typewriterInstance = new Typewriter(target, {
                loop: true,
                delay: 85,
                deleteSpeed: 35,
                cursor: "|",
                strings: ["buku favoritmu", "genre favoritmu", "penulis idolamu"],
                pauseFor: 2000,
                autoStart: true,
            });

            typewriterInstance
                .pauseFor(1000)
                .typeString("buku favoritmu")
                .pauseFor(2000)
                .deleteAll(35)
                .pauseFor(300)
                .typeString("genre favoritmu")
                .pauseFor(2000)
                .deleteAll(35)
                .pauseFor(300)
                .typeString("penulis idolamu")
                .pauseFor(2000)
                .deleteAll(35)
                .pauseFor(500)
                .start();
        };

        // Delay typewriter initialization
        const timeoutId = setTimeout(initTypewriter, 100);

        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
            if (typewriterInstance) {
                typewriterInstance.stop();
            }
        };
    }, []);

    return (
        <main className='pt-32'>
            <Suspense fallback={<LoadingFallback />}>
                    <BookSection
                      title="Semua buku"
                      subtitle="Top buku trending minggu ini"
                      badgeText="Trending"
                      badgeColor="red"
                      sortType={SORT_TYPES.TRENDING}
                      showRating={false}
                      rightLabel="Peminjam"
                    />
            </Suspense>
        </main>
    );
});

Book.displayName = 'Book';

export default Book;