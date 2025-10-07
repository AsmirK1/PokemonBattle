import {z} from "zod";
import pool from "@/lib/db";

export const LeaderboardInsert = z.object({
    username: z.string().min(1, "username required").max(30).trim(),
    score: z.number().int().nonnegative().max(999_999),
});

export type LeaderboardRow = {
    id: number;
    username: string;
    score: number;
    created_at: string;
};

export async function addScore(input: unknown): Promise<LeaderboardRow> {
    // Validate {username, score}
    const data = LeaderboardInsert.parse(input);
    const {username, score} = data;

    const result = await pool.query<LeaderboardRow>(
        `INSERT INTO leaderboard (username, score)
        VALUES ($1, $2)
        ON CONFLICT (username)
        DO UPDATE SET 
            score = GREATEST(leaderboard.score, EXCLUDED.score),
            created_at = CASE
                WHEN EXCLUDED.score > leaderboard.score THEN NOW()
                ELSE leaderboard.created_at
            END
        RETURNING id, username, score, created_at`,
        [username, score]
    );
    return result.rows[0];
}

export async function getTop(limit = 100): Promise<LeaderboardRow[]> {
    const {rows} = await pool.query<LeaderboardRow>(
        `SELECT id, username, score, created_at
        FROM leaderboard
        ORDER BY score DESC, created_at DESC
        limit $1`,
        [limit]
    );
    return rows;
}

/* Why this file?

Gives you a single place to insert & read leaderboard rows.

Zod enforces the contract for { username, score }. */