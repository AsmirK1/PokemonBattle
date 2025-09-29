import { z } from 'zod';

export const BattleMoveSchema = z.object({
  name: z.string(),
  power: z.number().nullable(),
  type: z.object({
    name: z.string(),
  }),
  damage_class: z.object({
    name: z.string(),
  }),
});

export type BattleMove = z.infer<typeof BattleMoveSchema>;

export const PokemonWithMovesSchema = z.object({
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
  moves: z.array(z.object({
    move: z.object({
      name: z.string(),
      url: z.string().url(),
    }),
  })),
});

export type PokemonWithMoves = z.infer<typeof PokemonWithMovesSchema>;

export type BattleState = 'selecting' | 'fighting' | 'player-turn' | 'enemy-turn' | 'player-win' | 'enemy-win' | 'draw';

export interface BattleLogEntry {
  turn: number;
  message: string;
  type: 'attack' | 'damage' | 'effect' | 'win' | 'info';
}

export interface BattleStats {
  playerHealth: number;
  enemyHealth: number;
  playerMaxHealth: number;
  enemyMaxHealth: number;
  turn: number;
}

export interface PokemonSelection {
  id: number;
  name: string;
  image: string;
  types: string[];
}