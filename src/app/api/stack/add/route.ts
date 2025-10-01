import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

async function getAuthenticatedUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
    }
    
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, name, email FROM users LIMIT 1'
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    // Read body just once
    const body = await request.json();
    const { pokemonId, pokemonName, pokemonData } = body;

    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Validation
    if (!pokemonId || !pokemonName) {
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      );
    }

    console.log(`Adding ${pokemonName} to stack for user ${user.name}`);

    // Check existing
    const existingResult = await client.query(
      'SELECT id FROM user_pokemon WHERE user_id = $1 AND pokemon_id = $2',
      [user.id, pokemonId]
    );

    if (existingResult.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Pokemon already in stack'
      });
    }

    // Add to the base
    const insertResult = await client.query(
      `INSERT INTO user_pokemon (user_id, pokemon_id, pokemon_name, pokemon_data) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user.id, pokemonId, pokemonName, pokemonData]
    );

    console.log(`✅ Pokemon added to database`);

    return NextResponse.json({
      success: true,
      message: 'Pokemon added to stack',
      data: insertResult.rows[0]
    });

  } catch (error: any) {
    console.error('Error:', error);
    
    if (error.code === '23505') {
      return NextResponse.json({
        success: true,
        message: 'Pokemon already in stack'
      });
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}