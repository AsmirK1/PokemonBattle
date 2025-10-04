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

    // quick validation feedback (optional, not required because addScore validates too)
    const parsed = LeaderboardInsert.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const row = await addScore(parsed.data);
    return NextResponse.json({ ok: true, row }, { status: 201 });
  } catch (err: any) {
    // if Zod throws inside addScore
    if (err?.name === "ZodError") {
      return NextResponse.json({ ok: false, error: err.issues }, { status: 400 });
    }
    console.error("POST /api/leaderboard failed:", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
