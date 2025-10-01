type Row = {
    username: string;
    score: number;
    date: string;
    rank: number;
}

async function getLeaderboard(): Promise<Row[]> {
    // const rows = await db.select().from(leaderboard).orderBy(desc(leaderboard.score));
    // return rows;
    return [];
}

function Medal({rank}:{rank: number}) {
    if (rank === 1) return <span title="1st" className="text-2xl">🥇</span>
    if (rank === 2) return <span title="2nd" className="text-2xl">🥈</span>
    if (rank === 2) return <span title="3rd" className="text-2xl">🥉</span>
    return (
        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border bg-white px-2 text-xs font-medium text-gray-700">
            {rank}
        </span>
    )
}



export default async function LeaderboardPage() {
    const rows = (await getLeaderboard())
        .sort((a,b) => b.score - a.score)
        .map((r,i) => ({
            rank: i + 1,
            username: r.username,
            score: r.score,
            date: r.date,
        }));

    const hasRows = rows.length > 0;

    return (
        <section className="space-y-6">
            <header>
                <h1 className="text-3xl font-semibold tracking-tight"></h1>
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
                                <div className="col-span-2 sm:col-span-1 flex items-center ">
                                    <Medal rank={row.rank}/> 
                                </div>

                                <div className="col-span-5 sm:col-span-6 flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-gray-200" aria-hidden/>
                                    <div className="min-w-0">
                                        <div className="truncate font-medium text-gray-900">
                                            {row.username}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(row.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 sm:col-span-2 flex justify-end">
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
    )
}