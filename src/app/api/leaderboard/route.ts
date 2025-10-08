// src/app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addScore, getTop, LeaderboardInsert } from "@/lib/leaderboard";

export async function GET() {
  // return top scores (useful for debugging or client fetches)
  const rows = await getTop(100);
  return NextResponse.json({ ok: true, rows });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // optional quick validation (lib also validates):
    LeaderboardInsert.parse(body);

    const row = await addScore(body); // uses the lib function
    return NextResponse.json({ ok: true, row }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "invalid payload" },
      { status: 400 }
    );
  }
}
