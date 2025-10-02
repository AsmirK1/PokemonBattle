import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
    throw new Error("Database Url is missing. Add it to .env.local")
}

export const sql = neon(process.env.DATABASE_URL!)