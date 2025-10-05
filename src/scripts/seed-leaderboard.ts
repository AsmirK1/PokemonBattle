// src/scripts/seed-leaderboard.ts
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const client = await import("../lib/db.js");
  const pool = client.default;

  try {
    console.log("🌱 Seeding leaderboard…");
    // parameterized inserts (safe)
    await pool.query(
      `INSERT INTO leaderboard (username, score) VALUES ($1, $2)`,
      ["Red", 2980]
    );
    await pool.query(
      `INSERT INTO leaderboard (username, score) VALUES ($1, $2)`,
      ["Misty", 1756]
    );
    console.log("✅ Seeded two rows.");
  } catch (e: any) {
    console.error("❌ Seed failed:", e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
