import React, { memo } from 'react';
import { Check } from 'react-feather';

const AuthorCard = memo(({ author }) => (
  <div className="glass-effect rounded-2xl p-6 card-glow transition-all duration-300 hover:-translate-y-2 border border-purple-500/10">
    <div className="relative w-20 h-20 mx-auto mb-4">
      <img 
        src={author.image} 
        alt={author.name} 
        className="w-full h-full rounded-full object-cover border-2 border-purple-500"
        loading="lazy" 
      />
      <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2">
        <Check size={16} />
      </div>
    </div>
    <div className="text-center mb-4">
      <h3 className="font-medium text-lg">{author.name}</h3>
      <p className="text-gray-400 text-sm">@{author.username}</p>
    </div>
    <div className="flex justify-between text-sm border-t border-purple-500/10 pt-4">
      <StatItem label="Buku" value={author.books} />
      <StatItem label="Suka" value={`${author.likes}K`} />
      <StatItem label="Pembaca" value={`${author.readers}K`} />
    </div>
  </div>
));

const StatItem = memo(({ label, value }) => (
  <div>
    <p className="text-gray-400">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
));

const Penulis = memo(() => {
  const authors = [
    {
      name: "Pidi Baiq",
      username: "pidi_baiq",
      image: "/assets/author/author.jpg",
      books: 12,
      likes: 10,
      readers: 90
    },
    // Add more authors as needed
  ];

  return (
    <section className="px-16 mx-2 mb-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold">Penulis Top</h2>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">
              Popular
            </span>
          </div>
          <p className="text-gray-400 mt-2">List top penulis saat ini</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {authors.map((author, index) => (
          <AuthorCard key={index} author={author} />
        ))}
      </div>
    </section>
  );
});

AuthorCard.displayName = 'AuthorCard';
StatItem.displayName = 'StatItem';
Penulis.displayName = 'Penulis';

export default Penulis;