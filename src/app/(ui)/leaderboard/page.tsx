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



export default function LeaderboardPage() {
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

           
        </section>
    )
}