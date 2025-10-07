import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { addScore } from '@/lib/leaderboard';

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { userId, result } = (await request.json()) as {
      userId?: number;
      result?: 'win' | 'draw' | 'lose'; // 'win' ili 'lose'
    };

    if (!userId || !result) {
      return NextResponse.json({ success: false, error: 'Missing userId or result' }, { status: 400 });
    }

    // Odredi score change
    const scoreChange =
      result === 'win'  ? 100 :
      result === 'draw' ? 50  :
                          -50;

    // Update user score u bazi
    const updateResult = await client.query(
      `UPDATE users
         SET userscore = GREATEST(0, userscore + $1)
       WHERE id = $2
       RETURNING id, name, userscore`,
      [scoreChange, userId]
    );

    if (updateResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const updatedUser = updateResult.rows[0];

    // best-effort: update public leaderboard with the new TOTAL
    try {
      await addScore({ username: updatedUser.name, score: updatedUser.userscore });
    } catch (e) {
      console.error('Non-fatal: failed to upsert leaderboard row', e);
    }

    return NextResponse.json({
      success: true,
      message:
        result === 'lose'
          ? `Score decreased by ${Math.abs(scoreChange)}`
          : `Score increased by ${Math.abs(scoreChange)}`,
      newScore: updatedUser.userscore,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating score:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update score: ' + error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}



