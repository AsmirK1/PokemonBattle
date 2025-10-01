import { useState } from 'react';
import Link from 'next/link';
import { Pokemon } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const [buttonText, setButtonText] = useState('Add to Stack');
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
  const primaryType = pokemon.types[0]?.type.name || 'normal';

  // Colors for different Pokemon types
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

  const handleAddToStack = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      console.log('User must be logged in to add to stack');
      return;
    }

    setIsLoading(true);
    console.log(`Adding ${pokemon.name} to stack`);

    try {
      // Send request to your API to add pokemon to user's stack
      const response = await fetch('/api/stack/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonData: pokemon // Send the complete pokemon data
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Change button state to "Added"
        setButtonText('Added!');
        setIsAdded(true);

        // revert back to "Add to Stack" after 2 seconds
        setTimeout(() => {
          setButtonText('Add to Stack');
          setIsAdded(false);
        }, 2000);
      } else {
        console.error('Failed to add to stack:', result.error);
        setButtonText('Error!');
        setTimeout(() => setButtonText('Add to Stack'), 2000);
      }
    } catch (error) {
      console.error('Error adding to stack:', error);
      setButtonText('Error!');
      setTimeout(() => setButtonText('Add to Stack'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/pokemon/${pokemon.id}`} className="block">
      <div className="group relative bg-accent rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[primaryType]} opacity-20`}></div>
        
        <div className="relative p-6">
          {/* Pokemon ID */}
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-sm font-bold text-[#333333]">
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
          </div>
          
          {/* Pokemon Image */}
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 flex items-center justify-center">
              <img 
                src={imageUrl} 
                alt={pokemon.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Pokemon Name */}
          <h3 className="text-xl font-bold text-center capitalize mb-2 text-[#333333]">
            {pokemon.name}
          </h3>
          
          {/* Pokemon Types */}
          <div className="flex justify-center gap-2">
            {pokemon.types.map((typeInfo, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${typeColors[typeInfo.type.name] || 'bg-gray-400'}`}
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>

          {/* Add to Stack Button - Only show if user is authenticated */}
          {isAuthenticated && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleAddToStack}
                disabled={isLoading || isAdded}
                className={`
                  cursor-pointer  
                  relative z-5
                  px-3 py-1.5 text-xs
                  sm:px-4 sm:py-2 sm:text-sm
                  md:px-5 md:py-2.5 md:text-base
                  rounded-lg font-semibold 
                  w-full sm:w-auto
                  transition-all duration-300
                  shadow-md
                  ${
                    isAdded 
                      ? 'bg-green-500 hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.7)]' 
                      : 'bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.7)]'
                  }
                  hover:shadow-lg
                  active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isLoading ? 'Adding...' : buttonText}
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="mt-4 flex justify-between text-xs text-[#333333]/80">
            <span>Height: {pokemon.height / 10}m</span>
            <span>Weight: {pokemon.weight / 10}kg</span>
          </div>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>
    </Link>
  );
}