// src/scripts/create-leaderboard.ts
// Creates `leaderboard` with: id, username NOT NULL, score NOT NULL, created_at default now.
import { config } from "dotenv";
import path from "path";

// Load .env.local so DATABASE_URL is available locally
config({path:path.resolve(process.cwd(), '.env.local')});

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing. Add it to .env.local");
    process.exit(1)
}

async function main() {
    const client = await import("../lib/db.js"); // uses your existing pg Pool
    const pool = client.default;

    try {
        console.log("🔧 Ensuring `leaderboard` table exists...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS leaderboard (
                id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                username TEXT NOT NULL,
                score INTEGER NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        // Add any missing columns if the table already existed with a different shape
        await pool.query(`
        DO $$
        BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'leaderboard' AND column_name = 'username'
        ) THEN
            ALTER TABLE leaderboard ADD COLUMN username TEXT;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'leaderboard' AND column_name = 'score'
        ) THEN
            ALTER TABLE leaderboard ADD COLUMN score INTEGER;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'leaderboard' AND column_name = 'created_at'
        ) THEN
            ALTER TABLE leaderboard ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
          END IF;
        END
        $$;
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_leaderboard_score_created
            On leaderboard (score DESC, created_at DESC NULLS LAST);
            `)
        console.log("✅ leaderboard table ready");;
        
    } catch (e:any) {
        console.error("❌ Failed to create leaderboard table:", e.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}
main()
