interface BattleHealthBarProps {
  current: number;
  max: number;
  name: string;
  level: number;
  isEnemy?: boolean;
}

export default function BattleHealthBar({ current, max, name, level, isEnemy = false }: BattleHealthBarProps) {
  const percentage = Math.max(0, (current / max) * 100);
  
  let healthColor = 'bg-green-500';
  let bgColor = 'bg-green-500/20';
  if (percentage <= 25) {
    healthColor = 'bg-red-500';
    bgColor = 'bg-red-500/20';
  } else if (percentage <= 50) {
    healthColor = 'bg-yellow-500';
    bgColor = 'bg-yellow-500/20';
  }

  return (
    <div className={`${bgColor} rounded-2xl p-4 shadow-lg backdrop-blur-sm border-2 border-white/20`}>
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-white capitalize text-lg drop-shadow-lg">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-white/80 text-sm">Lv.</span>
          <span className="text-white font-bold text-lg">{level}</span>
        </div>
      </div>
      
      {/* HP Text */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-white text-sm font-semibold">HP</span>
        <span className="text-white font-mono text-sm">
          {current}/{max}
        </span>
      </div>
      
      {/* Health Bar */}
      <div className="bg-black/30 rounded-full h-4 overflow-hidden border border-white/20">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${healthColor} relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 animate-pulse"></div>
        </div>
      </div>
      
      {/* Percentage */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-white/70 text-xs">
          {percentage > 0 ? `${Math.round(percentage)}%` : 'FAINTED'}
        </span>
        <span className="text-white/70 text-xs">
          {current > 0 ? 'ACTIVE' : 'KNOCKED OUT'}
        </span>
      </div>
    </div>
  );
}