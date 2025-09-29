import { PokemonWithMoves, BattleLogEntry } from './battleTypes';

// Effective multiplier based on type advantages
const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export class BattleEngine {
  private playerPokemon: PokemonWithMoves;
  private enemyPokemon: PokemonWithMoves;
  private playerHealth: number;
  private enemyHealth: number;
  private turn: number;
  private logs: BattleLogEntry[];

  constructor(playerPokemon: PokemonWithMoves, enemyPokemon: PokemonWithMoves) {
    this.playerPokemon = playerPokemon;
    this.enemyPokemon = enemyPokemon;
    this.playerHealth = this.calculateMaxHP(playerPokemon);
    this.enemyHealth = this.calculateMaxHP(enemyPokemon);
    this.turn = 1;
    this.logs = [];
  }

  private calculateMaxHP(pokemon: PokemonWithMoves): number {
    const hpStat = pokemon.stats.find(stat => stat.stat.name === 'hp');
    return Math.floor((hpStat?.base_stat || 50) * 2);
  }

  private calculateDamage(attacker: PokemonWithMoves, defender: PokemonWithMoves, movePower: number): number {
    const attackerType = attacker.types[0].type.name;
    const defenderTypes = defender.types.map(t => t.type.name);
    
    // Calculate type effectiveness
    let effectiveness = 1;
    defenderTypes.forEach(defType => {
      effectiveness *= TYPE_EFFECTIVENESS[attackerType]?.[defType] || 1;
    });

    // Critical hit chance (10%)
    const isCritical = Math.random() < 0.1;
    const criticalMultiplier = isCritical ? 1.5 : 1;

    // Random factor (0.85 to 1.0)
    const randomFactor = 0.85 + Math.random() * 0.15;

    const baseDamage = Math.floor(
      (((2 * 50) / 5 + 2) * movePower * 1) / 50
    );

    const totalDamage = Math.floor(baseDamage * effectiveness * criticalMultiplier * randomFactor);

    return Math.max(1, totalDamage);
  }

  private getEffectivenessMessage(attackerType: string, defenderTypes: string[]): string {
    let effectiveness = 1;
    defenderTypes.forEach(defType => {
      effectiveness *= TYPE_EFFECTIVENESS[attackerType]?.[defType] || 1;
    });

    if (effectiveness === 0) return "It doesn't affect the target!";
    if (effectiveness > 1) return "It's super effective!";
    if (effectiveness < 1) return "It's not very effective...";
    return "";
  }

  async playerAttack(moveIndex: number): Promise<{ damage: number; logs: BattleLogEntry[] }> {
    const move = this.playerPokemon.moves[moveIndex];
    const movePower = 40 + Math.floor(Math.random() * 60);
    
    const damage = this.calculateDamage(this.playerPokemon, this.enemyPokemon, movePower);
    this.enemyHealth = Math.max(0, this.enemyHealth - damage);

    const newLogs: BattleLogEntry[] = [
      {
        turn: this.turn,
        message: `${this.playerPokemon.name} used ${move.move.name}!`,
        type: 'attack'
      },
      {
        turn: this.turn,
        message: this.getEffectivenessMessage(this.playerPokemon.types[0].type.name, this.enemyPokemon.types.map(t => t.type.name)),
        type: 'effect'
      },
      {
        turn: this.turn,
        message: `It dealt ${damage} damage to ${this.enemyPokemon.name}!`,
        type: 'damage'
      }
    ];

    this.logs.push(...newLogs);
    return { damage, logs: newLogs };
  }

  async enemyAttack(): Promise<{ damage: number; logs: BattleLogEntry[] }> {
    const moveIndex = Math.floor(Math.random() * Math.min(4, this.enemyPokemon.moves.length));
    const move = this.enemyPokemon.moves[moveIndex];
    const movePower = 40 + Math.floor(Math.random() * 60);
    
    const damage = this.calculateDamage(this.enemyPokemon, this.playerPokemon, movePower);
    this.playerHealth = Math.max(0, this.playerHealth - damage);

    const newLogs: BattleLogEntry[] = [
      {
        turn: this.turn,
        message: `${this.enemyPokemon.name} used ${move.move.name}!`,
        type: 'attack'
      },
      {
        turn: this.turn,
        message: this.getEffectivenessMessage(this.enemyPokemon.types[0].type.name, this.playerPokemon.types.map(t => t.type.name)),
        type: 'effect'
      },
      {
        turn: this.turn,
        message: `It dealt ${damage} damage to ${this.playerPokemon.name}!`,
        type: 'damage'
      }
    ];

    this.logs.push(...newLogs);
    this.turn++;
    return { damage, logs: newLogs };
  }

  getBattleStats() {
    return {
      playerHealth: this.playerHealth,
      enemyHealth: this.enemyHealth,
      playerMaxHealth: this.calculateMaxHP(this.playerPokemon),
      enemyMaxHealth: this.calculateMaxHP(this.enemyPokemon),
      turn: this.turn,
    };
  }

  getLogs(): BattleLogEntry[] {
    return this.logs;
  }

  checkBattleOver(): 'player-win' | 'enemy-win' | 'draw' | null {
    if (this.playerHealth <= 0 && this.enemyHealth <= 0) return 'draw';
    if (this.playerHealth <= 0) return 'enemy-win';
    if (this.enemyHealth <= 0) return 'player-win';
    return null;
  }
}