'use client';

import { useState, useEffect, useRef } from 'react';
import { PokemonWithMoves, BattleLogEntry, BattleStats, BattleState, PokemonSelection } from '@/lib/battleTypes';
import { BattleEngine } from '@/lib/battleLogic';
import BattlePokemonCard from './BattlePokemonCard';
import BattleControls from './BattleControls';
import BattleLog from './BattleLog';
import BattleAnimations from './BattleAnimations';
import PokemonSelectionPopup from './PokemonSelectionPopup';
import { submitLeaderboardScore } from "@/lib/battleApi";
import { useAuth } from "@/contexts/AuthContext"; 


interface BattleArenaProps {
  enemyPokemon: PokemonWithMoves;
  popularPokemons: PokemonSelection[];
}

export default function BattleArena({ enemyPokemon, popularPokemons }: BattleArenaProps) {
  const [playerPokemon, setPlayerPokemon] = useState<PokemonWithMoves | null>(null);
  const [currentEnemyPokemon, setCurrentEnemyPokemon] = useState<PokemonWithMoves>(enemyPokemon);
  const [battleEngine, setBattleEngine] = useState<BattleEngine | null>(null);
  const [battleState, setBattleState] = useState<BattleState>('selecting');
  const [battleStats, setBattleStats] = useState<BattleStats | null>(null);
  const [battleLogs, setBattleLogs] = useState<BattleLogEntry[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isEnemyAttacking, setIsEnemyAttacking] = useState(false);
  const [isTakingDamage, setIsTakingDamage] = useState(false);
  const [isEnemyTakingDamage, setIsEnemyTakingDamage] = useState(false);
  const [showSelectionPopup, setShowSelectionPopup] = useState(false);
  const [showResultScreen, setShowResultScreen] = useState(false);

const { user, isAuthenticated } = (useAuth as any)?.() || {};

  // simple scoring: win=100, draw=50, lose=0
function computeScore(result: BattleState): number {
  if (result === "player-win") return 100;
  if (result === "draw") return 50;
  return 0; // enemy-win
}

// If not logged in, prompt once and write to leaderboard
const postedRef = useRef(false);

function computeScore(result: BattleState) {
  if (result === "player-win") return 100;
  if (result === "draw") return 50;
  return 0;
}

async function handleGuestPost(result: BattleState) {
  if (isAuthenticated) return;       // logged-in users skip prompt
  if (postedRef.current) return;
  postedRef.current = true;

  try {
    const username = (prompt("Enter your trainer name for the leaderboard:") || "").trim();
    if (!username) { postedRef.current = false; return; }

    await submitLeaderboardScore(username, computeScore(result));
    window.location.href = "/leaderboard";
  } catch (e) {
    console.error(e);
    postedRef.current = false;
    alert("Could not add your score to the leaderboard. Please try again.");
  }
}


async function submitLoggedInResult(result: BattleState) {
  if (!isAuthenticated || !user?.id) return;
  const mapped = result === "player-win" ? "win" : "lose"; // map "draw" to "lose" for now
  try {
    await fetch("/api/battle/update-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, result: mapped }),
    });
    // optional: window.location.href = "/leaderboard";
  } catch (e) {
    console.error("Failed to update score", e);
  }
}


  

  // Initialize battle when player selects Pokemon
  const initializeBattle = (selectedPokemon: PokemonWithMoves) => {
    setPlayerPokemon(selectedPokemon);
    const engine = new BattleEngine(selectedPokemon, currentEnemyPokemon);
    setBattleEngine(engine);
    setBattleStats(engine.getBattleStats());
    setBattleState('player-turn');
    setShowSelectionPopup(false);
    setShowResultScreen(false);
    
    setBattleLogs([{
      turn: 0,
      message: `A wild ${currentEnemyPokemon.name} appeared!`,
      type: 'info'
    }, {
      turn: 0,
      message: `Go! ${selectedPokemon.name}!`,
      type: 'info'
    }]);
  };

  const handlePlayerAttack = async (moveIndex: number) => {
    if (!battleEngine || battleState !== 'player-turn') return;

    setIsAttacking(true);
    setBattleState('fighting');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const { logs: attackLogs } = await battleEngine.playerAttack(moveIndex);
    
    setBattleLogs(prev => [...prev, ...attackLogs]);
    setBattleStats(battleEngine.getBattleStats());
    setIsEnemyTakingDamage(true);
    
    const battleResult = battleEngine.checkBattleOver();
    if (battleResult) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBattleState(battleResult);
      setShowResultScreen(true);
      setBattleLogs(prev => [...prev, {
        turn: battleStats?.turn || 1,
        message: battleResult === 'player-win' 
        ? `🎉 ${playerPokemon!.name} won the battle!` 
        : battleResult === 'enemy-win'
        ? `💥 ${currentEnemyPokemon.name} won the battle!`
        : "🤝 It's a draw!",
        type: 'win'
      }]);
      await (isAuthenticated ? submitLoggedInResult(battleResult) : handleGuestPost(battleResult));
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAttacking(false);
    setIsEnemyTakingDamage(false);
    setBattleState('enemy-turn');

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEnemyAttacking(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const { logs: enemyLogs } = await battleEngine.enemyAttack();
    
    setBattleLogs(prev => [...prev, ...enemyLogs]);
    setBattleStats(battleEngine.getBattleStats());
    setIsTakingDamage(true);

    const enemyBattleResult = battleEngine.checkBattleOver();
    if (enemyBattleResult) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBattleState(enemyBattleResult);
      setShowResultScreen(true);
      setBattleLogs(prev => [...prev, {
        turn: battleStats?.turn || 1,
        message: enemyBattleResult === 'player-win' 
          ? `🎉 ${playerPokemon!.name} won the battle!` 
          : enemyBattleResult === 'enemy-win'
          ? `💥 ${currentEnemyPokemon.name} won the battle!`
          : "🤝 It's a draw!",
        type: 'win'
      }]);
      await (isAuthenticated ? submitLoggedInResult(enemyBattleResult) : handleGuestPost(enemyBattleResult));

      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEnemyAttacking(false);
    setIsTakingDamage(false);
    setBattleState('player-turn');
  };

  const resetBattle = async () => {
    // Reset all battle states
    setPlayerPokemon(null);
    setBattleEngine(null);
    setBattleState('selecting');
    setBattleStats(null);
    setBattleLogs([]);
    setShowResultScreen(false);
    postedRef.current = false;

    
    // Reset animation states
    setIsAttacking(false);
    setIsEnemyAttacking(false);
    setIsTakingDamage(false);
    setIsEnemyTakingDamage(false);
    
    // Get a new random enemy Pokemon
    try {
      const response = await fetch('/api/random-pokemon');
      const newEnemyPokemon = await response.json();
      setCurrentEnemyPokemon(newEnemyPokemon);
    } catch (error) {
      console.error('Error fetching new enemy Pokemon:', error);
      // Fallback: use the original enemy Pokemon
      setCurrentEnemyPokemon(enemyPokemon);
    }
  };

  const openSelectionPopup = () => {
    setShowSelectionPopup(true);
  };

  return (
    <div className="min-h-screen bg-[#CCCCCC] p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px, rgba(255,255,255,0.15) 1px, transparent 0)] bg-[length:20px_20px] animate-pulse"></div>
      
      <div className="relative z-10 container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-[#333333] mb-4 drop-shadow-2xl">
            POKEMON BATTLE
          </h1>
          <div className="text-[#333333] text-lg md:text-xl drop-shadow-lg bg-white/20 rounded-full px-6 py-2 inline-block">
            {battleState === 'selecting' ? 'CHOOSE YOUR POKEMON' : `Turn: ${battleStats?.turn || 1} | ${battleState.replace('-', ' ').toUpperCase()}`}
          </div>
        </div>

        {/* Battle Arena */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Player Pokemon Area */}
          <div className="xl:col-span-1 flex justify-center">
            {playerPokemon ? (
              <BattlePokemonCard
                pokemon={playerPokemon}
                health={battleStats?.playerHealth || 0}
                maxHealth={battleStats?.playerMaxHealth || 100}
                isAttacking={isAttacking}
                isTakingDamage={isTakingDamage}
              />
            ) : (
              <div 
                onClick={openSelectionPopup}
                className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-dashed border-white/30 w-full max-w-sm cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:border-white/50 group"
              >
                <div className="text-center text-[#333333] h-64 flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🎮</div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
                    Choose Your Pokemon
                  </h3>
                  <p className="text-[#333333]text-[#333333] mb-4 group-hover:text-white transition-colors duration-300">
                    Click to select your Pokemon!
                  </p>
                  <div className="bg-yellow-400/20 rounded-full px-4 py-2 border border-yellow-400/50 group-hover:bg-yellow-400/30 transition-all duration-300">
                    <span className="text-[#333333] font-semibold">CLICK TO SELECT</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Battle Controls */}
          <div className="xl:col-span-1 flex items-center justify-center">
            {playerPokemon ? (
              <BattleControls
                pokemon={playerPokemon}
                onAttack={handlePlayerAttack}
                disabled={battleState !== 'player-turn'}
                isPlayerTurn={battleState === 'player-turn'}
              />
            ) : (
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 text-center shadow-lg border-2 border-white/20">
                <div className="text-[#333333] text-lg font-semibold mb-4">
                  Waiting for Pokemon selection...
                </div>
                <p className="text-[#333333] text-sm">
                  Click on "Choose Your Pokemon" to select your fighter!
                </p>
              </div>
            )}
          </div>

          {/* Enemy Pokemon */}
          <div className="xl:col-span-1 flex justify-center">
            <BattlePokemonCard
              pokemon={currentEnemyPokemon}
              health={battleStats?.enemyHealth || currentEnemyPokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 100}
              maxHealth={battleStats?.enemyMaxHealth || currentEnemyPokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 100}
              isEnemy={true}
              isAttacking={isEnemyAttacking}
              isTakingDamage={isEnemyTakingDamage}
            />
          </div>
        </div>

        {/* Battle Log */}
        <div className="mb-8">
          <BattleLog logs={battleLogs} />
        </div>

        {/* Pokemon Selection Popup */}
        {showSelectionPopup && (
          <PokemonSelectionPopup
            popularPokemons={popularPokemons}
            onSelect={initializeBattle}
            onClose={() => setShowSelectionPopup(false)}
          />
        )}

        {/* Result Screen */}
        {showResultScreen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-8 max-w-md text-center shadow-2xl transform animate-scale-in border-4 border-yellow-400">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                {battleState === 'player-win' && 'Victory!'}
                {battleState === 'enemy-win' && 'Defeat!'}
                {battleState === 'draw' && 'Draw!'}
              </h2>
              
              <p className="text-gray-600 mb-6 text-lg">
                {battleState === 'player-win' && `Congratulations! Your ${playerPokemon!.name} won!`}
                {battleState === 'enemy-win' && `The wild ${currentEnemyPokemon.name} was too strong!`}
                {battleState === 'draw' && 'Both Pokemon fainted at the same time!'}
              </p>
              
              <div className="flex gap-4 justify-center flex-col sm:flex-row">
                <button
                  onClick={resetBattle}
                  className="bg-gradient-to-r from-green-500 to-blue-600 text-[#333333] px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  🔄 New Battle
                </button>
                <button
                  onClick={() => window.location.href = '/homepage'}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-[#333333] px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  🏠 Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Battle Animations - Ovo će se sada resetovati kada se klikne New Battle */}
        <BattleAnimations
          showAttack={isAttacking || isEnemyAttacking}
          showDamage={isTakingDamage || isEnemyTakingDamage}
          showVictory={battleState === 'player-win' && showResultScreen}
          showDefeat={battleState === 'enemy-win' && showResultScreen}
        />
      </div>
    </div>
  );
}