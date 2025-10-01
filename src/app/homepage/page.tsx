'use client';

import { useState, useEffect } from 'react';
import { getMultiplePokemons } from '@/lib/api';
import { Pokemon } from '@/lib/types';
import PokemonGrid from '@/components/PokemonGrid';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Homepage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const loadInitialPokemons = async () => {
    setLoading(true);
    try {
      // Učitaj prvih 20 Pokemon-a
      const initialIds = Array.from({ length: 20 }, (_, i) => i + 1);
      const initialPokemons = await getMultiplePokemons(initialIds);
      setPokemons(initialPokemons);
      setOffset(20);
    } catch (error) {
      console.error('Error loading initial Pokemons:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePokemons = async () => {
    setLoadingMore(true);
    try {
      // Učitaj sljedećih 20 Pokemon-a
      const nextIds = Array.from({ length: 20 }, (_, i) => offset + i + 1);
      const nextPokemons = await getMultiplePokemons(nextIds);
      setPokemons(prev => [...prev, ...nextPokemons]);
      setOffset(prev => prev + 20);
    } catch (error) {
      console.error('Error loading more Pokemons:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadInitialPokemons();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#CCCCCC]">
      {/* Header */}
      <header className="bg-accent/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-text/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#333333]">
              Pokemon
            </h1>
            <p className="text-[#333333] mt-2 text-center text-lg">
              Discover and explore your favorite Pokemons from the wonderful world of Pokemon
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <PokemonGrid pokemons={pokemons} />
        
        {/* Load More Button */}
        <div className="flex justify-center mt-8 mb-12">
          <button
            onClick={loadMorePokemons}
            disabled={loadingMore}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-[#333333] px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#333333]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading More...
              </span>
            ) : (
              'Load More Pokemons'
            )}
          </button>
        </div>
      </main>
    </div>
  );
}