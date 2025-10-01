// src/scripts/setup-db.ts
import { config } from 'dotenv';
import path from 'path';

// Eksplicitno postavi putanju do .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('🔍 Looking for .env.local at:', envPath);

// Učitaj .env.local
const result = config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env.local:', result.error);
} else {
  console.log('✅ .env.local loaded successfully');
}

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is still not set!');
  process.exit(1);
}

async function setupDatabase() {
  const client = await import('../lib/db.js');
  
  try {
    console.log('🔧 Setting up database...');
    
    // Test connection - koristi client.query() umjesto template literals
    const versionResult = await client.default.query('SELECT version()');
    console.log('✅ Database connected:', versionResult.rows[0].version);
    
    // Kreiraj users tabelu
    await client.default.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Users table created successfully');

    // Kreiraj user_pokemon tabelu
    await client.default.query(`
      CREATE TABLE IF NOT EXISTS user_pokemon (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        pokemon_id INTEGER NOT NULL,
        pokemon_name VARCHAR(255) NOT NULL,
        pokemon_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        -- Osiguraj da user ne može imati istog pokemona više puta
        UNIQUE(user_id, pokemon_id)
      )
    `);
    
    console.log('✅ User_pokemon table created successfully');
    console.log('🎉 Database setup completed!');
    
  } catch (error: any) {
    console.error('❌ Database setup failed:', error.message);
    console.error('Full error:', error);
  } finally {
    // Zatvori connection pool
    await client.default.end();
    process.exit(0);
  }
}

setupDatabase();