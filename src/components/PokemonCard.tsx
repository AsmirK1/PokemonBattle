import Link from 'next/link';
import { Pokemon } from '@/lib/types';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
  const primaryType = pokemon.types[0]?.type.name || 'normal';

  // Boje za svaki tip (bez promjene)
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

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="group relative bg-accent rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer animate-fade-in">
        {/* Background gradient based on type */}
        <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[primaryType]} opacity-20`}></div>
        
        <div className="relative p-6">
          {/* Pokemon ID */}
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
            {/* PROMJENA 1: text-text -> text-[#333333] */}
            <span className="text-sm font-bold text-[#333333]">#{pokemon.id.toString().padStart(3, '0')}</span>
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
          {/* PROMJENA 2: text-text -> text-[#333333] */}
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

          {/* Stats */}
          {/* PROMJENA 3: text-text/80 -> text-[#333333]/80 */}
          <div className="mt-4 flex justify-between text-xs text-[#333333]/80">
            <span>Height: {pokemon.height / 10}m</span>
            <span>Weight: {pokemon.weight / 10}kg</span>
          </div>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>
    </Link>
  );
}