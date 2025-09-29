interface BattleAnimationsProps {
  showAttack: boolean;
  showDamage: boolean;
  showVictory?: boolean;
  showDefeat?: boolean;
}

export default function BattleAnimations({ 
  showAttack, 
  showDamage, 
  showVictory = false,
  showDefeat = false 
}: BattleAnimationsProps) {
  return (
    <>
      {/* Attack Animation */}
      {showAttack && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="animate-ping bg-yellow-400/50 rounded-full w-32 h-32"></div>
          <div className="absolute text-white text-2xl font-bold animate-bounce drop-shadow-2xl">
            ATTACK!
          </div>
        </div>
      )}
      
      {/* Damage Animation */}
      {showDamage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="animate-pulse bg-red-500/50 rounded-full w-48 h-48"></div>
          <div className="absolute text-white text-xl font-bold animate-pulse drop-shadow-2xl">
            DAMAGE!
          </div>
        </div>
      )}
    </>
  );
}