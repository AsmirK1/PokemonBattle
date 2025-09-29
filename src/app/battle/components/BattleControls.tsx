import { PokemonWithMoves } from '@/lib/battleTypes';

interface BattleControlsProps {
  pokemon: PokemonWithMoves;
  onAttack: (moveIndex: number) => void;
  disabled?: boolean;
  isPlayerTurn?: boolean;
}

export default function BattleControls({ 
  pokemon, 
  onAttack, 
  disabled = false,
  isPlayerTurn = true 
}: BattleControlsProps) {
  const availableMoves = pokemon.moves.slice(0, 4);

  const moveColors: Record<string, string> = {
    normal: 'bg-gray-400 hover:bg-gray-500',
    fire: 'bg-red-500 hover:bg-red-600',
    water: 'bg-blue-500 hover:bg-blue-600',
    electric: 'bg-yellow-400 hover:bg-yellow-500 text-gray-800',
    grass: 'bg-green-500 hover:bg-green-600',
    ice: 'bg-cyan-300 hover:bg-cyan-400 text-gray-800',
    fighting: 'bg-red-700 hover:bg-red-800',
    poison: 'bg-purple-500 hover:bg-purple-600',
    ground: 'bg-yellow-700 hover:bg-yellow-800',
    flying: 'bg-indigo-300 hover:bg-indigo-400 text-gray-800',
    psychic: 'bg-pink-500 hover:bg-pink-600',
    bug: 'bg-lime-500 hover:bg-lime-600',
    rock: 'bg-yellow-600 hover:bg-yellow-700',
    ghost: 'bg-purple-700 hover:bg-purple-800',
    dragon: 'bg-indigo-600 hover:bg-indigo-700',
    dark: 'bg-gray-800 hover:bg-gray-900',
    steel: 'bg-gray-500 hover:bg-gray-600',
    fairy: 'bg-pink-300 hover:bg-pink-400 text-gray-800',
  };

  if (!isPlayerTurn) {
    return (
      <div className="bg-accent rounded-2xl p-8 text-center shadow-lg">
        <div className="animate-pulse text-text text-xl font-bold">
          Enemy is thinking...
        </div>
        <div className="mt-4 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-text rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-text rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-text rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-accent rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-text mb-4 text-center">Choose Your Move</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {availableMoves.map((move, index) => {
          const moveType = pokemon.types[0]?.type.name || 'normal';
          return (
            <button
              key={index}
              onClick={() => onAttack(index)}
              disabled={disabled}
              className={`
                ${moveColors[moveType]}
                text-white font-bold py-4 px-4 rounded-xl
                transform transition-all duration-200
                hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:scale-100
                shadow-lg hover:shadow-xl
                text-sm md:text-base
              `}
            >
              <div className="capitalize font-semibold">
                {move.move.name.replace('-', ' ')}
              </div>
              <div className="text-xs opacity-90 mt-1">
                Power: {40 + Math.floor(Math.random() * 60)}
              </div>
            </button>
          );
        })}
      </div>
      
      {disabled && (
        <div className="mt-4 text-center text-text/70 text-sm">
          Processing battle...
        </div>
      )}
    </div>
  );
}