import { z } from 'zod';

export const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  sprites: z.object({
    front_default: z.string().url().nullable(),
    other: z.object({
      'official-artwork': z.object({
        front_default: z.string().url(),
      }),
    }),
  }),
  types: z.array(z.object({
    type: z.object({
      name: z.string(),
    }),
  })),
  height: z.number(),
  weight: z.number(),
  stats: z.array(z.object({
    base_stat: z.number(),
    stat: z.object({
      name: z.string(),
    }),
  })),
});

export type Pokemon = z.infer<typeof PokemonSchema>;

export const PokemonListSchema = z.object({
  count: z.number(),
  results: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
  })),
});

export type PokemonList = z.infer<typeof PokemonListSchema>;