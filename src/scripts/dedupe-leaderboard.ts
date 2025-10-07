import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const client = await import("../lib/db.js");
  const pool = client.default;

  try {
    console.log("🧹 Removing duplicates (keep highest score, then newest) …");
    await pool.query(`
      DELETE FROM leaderboard l
      WHERE l.id NOT IN (
        SELECT id FROM (
          SELECT DISTINCT ON (username)
                 id
          FROM leaderboard
          ORDER BY username, score DESC, created_at DESC
        ) keepers
      )
    `);
    console.log("✅ Dedupe complete.");
  } catch (e:any) {
    console.error("❌ Dedupe failed:", e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
main();
