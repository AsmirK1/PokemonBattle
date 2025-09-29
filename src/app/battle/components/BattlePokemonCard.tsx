import { PokemonWithMoves } from '@/lib/battleTypes';
import BattleHealthBar from './BattleHealthBar';

interface BattlePokemonCardProps {
  pokemon: PokemonWithMoves;
  health: number;
  maxHealth: number;
  isEnemy?: boolean;
  isAttacking?: boolean;
  isTakingDamage?: boolean;
}

export default function BattlePokemonCard({ 
  pokemon, 
  health, 
  maxHealth, 
  isEnemy = false,
  isAttacking = false,
  isTakingDamage = false 
}: BattlePokemonCardProps) {
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
  const primaryType = pokemon.types[0]?.type.name || 'normal';

  const typeColors: Record<string, string> = {
    normal: 'from-gray-400 to-gray-600',
    fire: 'from-red-500 to-orange-600',
    water: 'from-blue-500 to-cyan-600',
    electric: 'from-yellow-400 to-yellow-500',
    grass: 'from-green-500 to-emerald-600',
    ice: 'from-cyan-300 to-blue-400',
    fighting: 'from-red-700 to-red-800',
    poison: 'from-purple-500 to-pink-600',
    ground: 'from-yellow-700 to-yellow-800',
    flying: 'from-indigo-300 to-purple-400',
    psychic: 'from-pink-500 to-purple-500',
    bug: 'from-lime-500 to-green-600',
    rock: 'from-yellow-600 to-gray-600',
    ghost: 'from-purple-700 to-indigo-700',
    dragon: 'from-indigo-600 to-purple-600',
    dark: 'from-gray-800 to-gray-900',
    steel: 'from-gray-500 to-gray-600',
    fairy: 'from-pink-300 to-rose-400',
  };

  return (
    <div className={`relative ${isEnemy ? '' : ''}`}>
      <BattleHealthBar 
        current={health} 
        max={maxHealth} 
        name={pokemon.name}
        level={Math.max(1, pokemon.id % 100)}
        isEnemy={isEnemy}
      />
      
      <div className={`
        relative mt-6
        ${isAttacking ? 'animate-attack-bounce' : ''}
        ${isTakingDamage ? 'animate-damage-shake' : ''}
        transition-all duration-300
      `}>
        {/* Main Card */}
        <div className={`
          relative bg-gradient-to-br ${typeColors[primaryType]} 
          rounded-3xl p-8 shadow-2xl border-4 border-white/30
          backdrop-blur-sm
          ${isEnemy ? 'rotate-3' : '-rotate-3'}
          transform transition-all duration-500
          hover:rotate-0 hover:scale-105
        `}>
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
          
          {/* Pokemon Image Container */}
          <div className="relative z-10 flex justify-center">
            <div className={`
              relative
              ${isAttacking ? 'animate-pulse' : ''}
              ${health <= 0 ? 'grayscale' : ''}
            `}>
              <img
                src={imageUrl}
                alt={pokemon.name}
                className={`
                  w-48 h-48 object-contain drop-shadow-2xl
                  transition-all duration-500
                  ${isAttacking ? 'scale-110' : ''}
                  ${isTakingDamage ? 'brightness-75' : ''}
                `}
              />
              
              {/* Attack Glow */}
              {isAttacking && (
                <div className="absolute inset-0 bg-yellow-400/40 rounded-full animate-ping"></div>
              )}
              
              {/* Damage Effect */}
              {isTakingDamage && (
                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
          
          {/* Type Badges - Now properly positioned for both player and enemy */}
          <div className={`absolute bottom-4 ${isEnemy ? 'left-4' : 'right-4'} flex gap-2 flex-col items-${isEnemy ? 'start' : 'end'}`}>
            {pokemon.types.map((typeInfo, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800 capitalize shadow-lg border border-white/50"
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>
          
          {/* Status Indicator */}
          <div className={`absolute top-4 ${isEnemy ? 'right-4' : 'left-4'} flex flex-col items-${isEnemy ? 'end' : 'start'}`}>
            <div className={`
              px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg
              ${health <= 0 ? 'bg-red-600' : 'bg-green-600'}
            `}>
              {health <= 0 ? 'FAINTED' : 'ACTIVE'}
            </div>
          </div>
        </div>
        
        {/* Floating Stats */}
        {health > 0 && (
          <div className={`
            absolute ${isEnemy ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} 
            top-1/2 transform -translate-y-1/2
            bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/50
            min-w-[120px]
          `}>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-800 mb-2">STATS</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">HP:</span>
                  <span className="font-bold text-green-600">{health}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ATK:</span>
                  <span className="font-bold text-red-500">
                    {pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 50}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DEF:</span>
                  <span className="font-bold text-blue-500">
                    {pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 50}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}