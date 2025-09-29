'use client';

import { useState } from 'react';
import { PokemonSelection, PokemonWithMoves } from '@/lib/battleTypes';
import { getPokemonWithMoves, getRandomPokemon } from '@/lib/battleApi';

interface PokemonSelectionPopupProps {
  popularPokemons: PokemonSelection[];
  onSelect: (pokemon: PokemonWithMoves) => void;
  onClose: () => void;
}

export default function PokemonSelectionPopup({ popularPokemons, onSelect, onClose }: PokemonSelectionPopupProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const typeColors: Record<string, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-300',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-600',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-600',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };

  const handleSelect = async (pokemonId: number) => {
    setIsLoading(true);
    try {
      const pokemon = await getPokemonWithMoves(pokemonId);
      onSelect(pokemon);
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomSelect = async () => {
    setIsLoading(true);
    try {
      const randomPokemon = await getRandomPokemon();
      onSelect(randomPokemon);
    } catch (error) {
      console.error('Error loading random Pokemon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#CCCCCC] rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-4 border-white/20 transform animate-scale-in">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#333333] mb-2">Choose Your Pokemon</h2>
          <p className="text-[#333333]">Select a Pokemon to start the battle against a wild Pokemon!</p>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-3xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg font-semibold">Loading Pokemon...</p>
            </div>
          </div>
        )}

        {/* Pokemon Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto p-2">
          {popularPokemons.map(pokemon => (
            <button
              key={pokemon.id}
              onClick={() => setSelectedPokemon(pokemon.id)}
              disabled={isLoading}
              className={`
                bg-white/90 rounded-2xl p-4 text-center transform transition-all duration-300
                hover:scale-105 hover:shadow-2xl border-4
                ${selectedPokemon === pokemon.id 
                  ? 'border-yellow-400 scale-105 shadow-2xl bg-yellow-50' 
                  : 'border-transparent hover:border-white/50'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-20 h-20 mx-auto mb-3 object-contain drop-shadow-lg"
              />
              <h3 className="font-bold text-gray-800 capitalize text-sm mb-2">
                {pokemon.name}
              </h3>
              <div className="flex justify-center gap-1 flex-wrap">
                {pokemon.types.map(type => (
                  <span
                    key={type}
                    className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${typeColors[type]}`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-6 pt-6 border-t border-white/20">
          {/* Random Pokemon Button */}
          <button
            onClick={handleRandomSelect}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-[#333333] px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>🎲</span>
            Choose Random
          </button>

         

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="bg-gradient-to-r from-gray-300 to-gray-500 text-[#333333] px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            <button
              onClick={() => selectedPokemon && handleSelect(selectedPokemon)}
              disabled={!selectedPokemon || isLoading}
              className={`
                bg-gradient-to-r from-yellow-400 to-orange-500 text-[#333333]
                px-8 py-3 rounded-full font-semibold shadow-lg
                transform transition-all duration-300
                hover:scale-105 hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed
                ${selectedPokemon ? 'animate-pulse' : ''}
              `}
            >
              Start Battle
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 text-center text-[#333333] text-sm">
          <p>Your opponent will be a wild random Pokemon!</p>
        </div>
      </div>
    </div>
  );
}