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
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Leaderboard</h1>
        <p className="mt-1 text-sm text-gray-500">Top trainers by battle score</p>
      </header>

      {!hasRows ? (
        <div className="rounded-2xl border bg-white p-8 text-center">
          <p className="text-gray-600">
            No scores yet. Finish a battle to post your first score!
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <ul className="divide-y">
            {rows.map((row) => (
              <li
                key={row.rank}
                className="grid grid-cols-12 items-center gap-3 px-4 py-3 odd:bg-white even:bg-gray-50"
              >
                {/* Rank / medal */}
                <div className="col-span-2 sm:col-span-1 flex items-center">
                  <Medal rank={row.rank} />
                </div>

                {/* Avatar + Username */}
                <div className="col-span-6 sm:col-span-7 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-200" aria-hidden />
                  <div className="min-w-0">
                    <div className="truncate font-medium text-gray-900">
                      {row.username}
                    </div>
                  </div>
                </div>

                {/* Score pill (right-aligned) */}
                <div className="col-span-4 sm:col-span-4 flex justify-end">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                    {row.score.toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
