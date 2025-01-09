import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const Hero = memo(() => {
  return (
    <section className="pt-24 px-2 mb-16">
      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <div className="absolute inset-0 via-transparent to-transparent z-10"></div>
          {/* Lazy load image */}
          <img 
            src="/assets/hero8.png" 
            alt="Books" 
            className="w-full h-full object-contain object-right"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="relative z-20 p-16 max-w-2xl">
          <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-6 inline-block">
            💡 Trending Collection
          </span>
          <div className="text-6xl font-bold mb-6 leading-tight">
            Jelajahi<br />
            <span id="dynamic-text" className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              buku favoritmu
            </span><br />
            dimana aja!
          </div>
          <p className="text-gray-400 text-xl mb-8 leading-relaxed">
            Akses ribuan buku-buku menarik dari penulis terkenal dan penerbit di seluruh dunia.
          </p>
          <div className="flex items-center space-x-6">
            <Link to='/buku' className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-medium hover:opacity-90 transition-all duration-300">
              Lihat Buku Trending
            </Link>
            <Link to='/' className="px-8 py-4 bg-purple-500/10 rounded-xl font-medium hover:bg-purple-500/20 transition-all duration-300 border border-purple-500/20">
              Lihat Semua Buku
            </Link>
          </div>
          <Stats />
        </div>
      </div>
    </section>
  );
});


const Stats = memo(() => (
  <div className="flex items-center space-x-12 mt-12">
    <StatItem count="100k+" label="Koleksi Buku" />
    <StatItem count="50k+" label="Penulis" />
    <StatItem count="75k+" label="Peminjam" />
  </div>
));

const StatItem = memo(({ count, label }) => (
  <div>
    <p className="text-3xl font-bold mb-1">{count}</p>
    <p className="text-gray-400">{label}</p>
  </div>
));

Hero.displayName = 'Hero';
Stats.displayName = 'Stats';
StatItem.displayName = 'StatItem';

export default Hero;