import { BattleLogEntry } from '@/lib/battleTypes';

interface BattleLogProps {
  logs: BattleLogEntry[];
}

export default function BattleLog({ logs }: BattleLogProps) {
  const getLogColor = (type: string) => {
    switch (type) {
      case 'attack': return 'text-blue-600';
      case 'damage': return 'text-red-600';
      case 'effect': return 'text-purple-600';
      case 'win': return 'text-green-600 font-bold';
      case 'info': return 'text-gray-600';
      default: return 'text-text';
    }
  };

  return (
    <div className="bg-accent rounded-2xl p-6 shadow-lg h-64 overflow-hidden">
      <h3 className="text-xl font-bold text-text mb-4">Battle Log</h3>
      
      <div className="h-48 overflow-y-auto space-y-2">
        {logs.length === 0 ? (
          <div className="text-text/70 text-center py-8">
            Battle will begin soon...
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${getLogColor(log.type)}`}
            >
              <span className="text-xs text-text/50 bg-white/50 rounded px-2 py-1 mt-1 flex-shrink-0">
                Turn {log.turn}
              </span>
              <span className="text-sm leading-relaxed flex-1">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}