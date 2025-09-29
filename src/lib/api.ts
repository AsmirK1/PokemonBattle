import { Pokemon, PokemonSchema, PokemonList, PokemonListSchema } from './types';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonList> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 3600 } // Cache za 1 sat
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  
  const data = await response.json();
  return PokemonListSchema.parse(data);
}

export async function getPokemonById(id: number): Promise<Pokemon> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`, {
    next: { revalidate: 3600 } // Cache za 1 sat
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon with id ${id}`);
  }
  
  const data = await response.json();
  return PokemonSchema.parse(data);
}

export async function getPokemonByName(name: string): Promise<Pokemon> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${name}`, {
    next: { revalidate: 3600 }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon with name ${name}`);
  }
  
  const data = await response.json();
  return PokemonSchema.parse(data);
}

export async function getMultiplePokemons(ids: number[]): Promise<Pokemon[]> {
  const promises = ids.map(id => getPokemonById(id));
  return Promise.all(promises);
}

export async function getFirstTwentyPokemons(): Promise<Pokemon[]> {
  const ids = Array.from({ length: 20 }, (_, i) => i + 1);
  return getMultiplePokemons(ids);
}