// src/app/leaderboard/page.tsx
// Server-rendered Leaderboard that reads from your team's Postgres via pg Pool.

import pool from "@/lib/db";

// The shape we expect back from the DB.
type DbRow = {
  username: string;     
  score: number; 
  created_at: string //timestamp from DB
};

// 1) Query top players (no dates assumed)
async function getLeaderboard(): Promise<DbRow[]> {
  const result = await pool.query<DbRow>(`
    SELECT username, score, created_at
    FROM leaderboard
    ORDER BY score DESC, created_at DESC
    LIMIT 100
  `);
  return result.rows;
}

// Small view helper for medals
function Medal({ rank }: { rank: number }) {
  if (rank === 1) return <span title="1st" className="text-2xl">🥇</span>;
  if (rank === 2) return <span title="2nd" className="text-2xl">🥈</span>;
  if (rank === 3) return <span title="3rd" className="text-2xl">🥉</span>;
  return (
    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border bg-white px-2 text-xs font-medium text-gray-700">
      {rank}
    </span>
  );
}

// 2) Page component (server)
export default async function LeaderboardPage() {
  const dbRows = await getLeaderboard();

  // Map DB rows to UI rows (add rank, format fields)
  const rows = dbRows.map((r, i) => ({
    rank: i + 1,
    username: r.username,
    score: r.score,
    date: new Date(r.created_at).toLocaleDateString(), 
  }));

  const hasRows = rows.length > 0;

 
return (
    <div className="min-h-screen bg-[#CCCCCC]">
        <section className=" leaderboard mx-auto max-w-4xl px-4 py-10">
            {/* PANEL WITH TOP TAB TITLE */}
            <div className="relative rounded-[24px] border-2 border-indigo-200 bg-blue-500 shadow-xl">
            {/* tab title chip */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <div className="rounded-full border border-indigo-200 bg-blue-300 px-10 py-2 font-semibold tracking-wide text-indigo-700 shadow-md">
                LEADERBOARD
                </div>
            </div>

            <div className="px-5 pt-8 pb-5">
                <p className="mb-4 text-center text-xs text-neutral-500">
                Top trainers by battle score
                </p>

                {!hasRows ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
                    <p className="text-neutral-600">
                    No scores yet. Finish a battle to post your first score!
                    </p>
                </div>
                ) : (
                // LIST CARD BODY
                <ul className="space-y-3">
                    {rows.map((row) => (
                    // ROW = rounded bar + light border, like the mock
                    <li
                        key={row.rank}
                        className="grid grid-cols-12 items-center gap-3 rounded-xl border border-neutral-200 bg-indigo-100 px-4 py-3 hover:bg-neutral-100 transition-colors"
                    >
                        {/* rank/medal */}
                        <div className="col-span-1 flex items-center">
                        <Medal rank={row.rank} />
                        </div>

                        {/* avatar + name/date */}
                        <div className="col-span-9 sm:col-span-9 md:col-span-9 lg:col-span-9 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-neutral-200" aria-hidden />
                        <div className="min-w-0">
                            <div className="truncate font-medium text-neutral-900">
                            {row.username}
                            </div>
                            <div className="text-[11px] text-neutral-500 leading-tight">
                            {row.date}
                            </div>
                        </div>
                        </div>

                        {/* score pill on the right */}
                        <div className="col-span-2 flex justify-end">
                        <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow">
                            {row.score.toLocaleString()}
                        </span>
                        </div>
                    </li>
                    ))}
                </ul>
                )}
            </div>
            </div>
        </section>
    </div>
    );
}



