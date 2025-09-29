import { getRandomPokemon, getPopularPokemons } from '@/lib/battleApi';
import BattleArena from './components/BattleArena';
import { PokemonWithMoves } from '@/lib/battleTypes';

export default async function BattlePage() {
  // Uvijek random protivnički Pokemon
  const enemyPokemon = await getRandomPokemon();
  const popularPokemons = await getPopularPokemons();

  return (
    <main>
      <BattleArena 
        enemyPokemon={enemyPokemon}
        popularPokemons={popularPokemons}
      />
    </main>
  );
}

export const dynamic = 'force-dynamic';