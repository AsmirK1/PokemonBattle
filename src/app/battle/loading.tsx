export default function BattleLoading() {
  return (
    <div className="min-h-screen bg-[#CCCCCC] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-white text-lg font-semibold">Loading Battle...</p>
        <p className="text-white/70 text-sm mt-2">Preparing your Pokemon for battle!</p>
      </div>
    </div>
  );
}