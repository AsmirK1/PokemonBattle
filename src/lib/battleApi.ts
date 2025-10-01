import { PokemonWithMoves, PokemonWithMovesSchema, BattleMove, BattleMoveSchema, PokemonSelection } from './battleTypes';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonWithMoves(id: number): Promise<PokemonWithMoves> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`, {
    next: { revalidate: 3600 }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon with moves for id ${id}`);
  }
  
  const data = await response.json();
  return PokemonWithMovesSchema.parse(data);
}

export async function getRandomPokemon(): Promise<PokemonWithMoves> {
  const randomId = Math.floor(Math.random() * 151) + 1; // First generation
  return getPokemonWithMoves(randomId);
}

export async function getMoveDetails(url: string): Promise<BattleMove> {
  const response = await fetch(url, {
    next: { revalidate: 3600 }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch move details`);
  }
  
  const data = await response.json();
  return BattleMoveSchema.parse(data);
}

export async function getBattlePokemons(playerId: number, enemyId?: number): Promise<{ player: PokemonWithMoves; enemy: PokemonWithMoves }> {
  const [player, enemy] = await Promise.all([
    getPokemonWithMoves(playerId),
    enemyId ? getPokemonWithMoves(enemyId) : getRandomPokemon()
  ]);
  
  return { player, enemy };
}

export async function getPopularPokemons(): Promise<PokemonSelection[]> {
  const popularIds = [1, 4, 7, 25, 150, 6, 9, 3, 94, 143, 130, 149]; // Popular Pokemon IDs
  const pokemons = await Promise.all(
    popularIds.map(id => getPokemonWithMoves(id))
  );
  
  return pokemons.map(pokemon => ({
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.other['official-artwork'].front_default,
    types: pokemon.types.map(t => t.type.name)
  }));
}