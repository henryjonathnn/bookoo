import React, { useEffect, lazy, Suspense } from 'react';
import { memo } from 'react';
import Typewriter from 'typewriter-effect/dist/core';
import '../../App.css'

// Lazy load components
const Trending = lazy(() => import('./Trending'));
const Favorit = lazy(() => import('./Favorit'));
const Hero = lazy(() => import('./Hero'));
const Penulis = lazy(() => import('./Penulis'));
const Ranking = lazy(() => import('./Ranking'));

// Loading fallback component
const LoadingFallback = () => (
    <div className="w-full h-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
);

// Memoized Home component
const Home = memo(() => {
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
        <main>
            <Suspense fallback={<LoadingFallback />}>
                <Hero />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Trending />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Favorit />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Penulis />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Ranking />
            </Suspense>
        </main>
    );
});

Home.displayName = 'Home';

export default Home;