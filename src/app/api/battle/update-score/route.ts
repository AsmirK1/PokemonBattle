import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { userId, result } = body; // 'win' ili 'lose'

    if (!userId || !result) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or result' },
        { status: 400 }
      );
    }

    // Odredi score change
    const scoreChange = result === 'win' ? 100 : -50;

    // Update user score u bazi
    const updateResult = await client.query(
      `UPDATE users 
       SET userscore = GREATEST(0, userscore + $1) -- Osiguraj da score ne bude negativan
       WHERE id = $2 
       RETURNING id, name, userscore`,
      [scoreChange, userId]
    );

    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = updateResult.rows[0];

    return NextResponse.json({
      success: true,
      message: `Score ${result === 'win' ? 'increased' : 'decreased'} by ${Math.abs(scoreChange)}`,
      newScore: updatedUser.userscore,
      user: updatedUser
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