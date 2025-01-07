import React, { useEffect } from 'react';
import Typewriter from 'typewriter-effect/dist/core';
import '../../App.css'
import Trending from './Trending';
import Favorit from './Favorit';
import Hero from './Hero';
import Penulis from './Penulis';
import Ranking from './Ranking';

export default function Home() {
    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Initialize typewriter effect
        const target = document.getElementById("dynamic-text");
        if (target) {
            const typewriter = new Typewriter(target, {
                loop: true,
                delay: 85,
                deleteSpeed: 35,
                cursor: "|",
                cursorClassName: "Typewriter__cursor",
                wrapperClassName: "Typewriter__wrapper",
                autoStart: true,
                strings: ["buku favoritmu", "genre favoritmu", "penulis idolamu"],
                pauseFor: 2000,
            });

            typewriter
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
        }
    }, []);

    return (
        <main>
            <Hero />
            <Trending />
            <Favorit />
            <Penulis />
            <Ranking />
        </main>
    );
}