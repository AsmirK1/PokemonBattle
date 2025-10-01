import bcrypt from 'bcryptjs';
import sql from './db';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export async function createUser(userData: { name: string; email: string; password: string }) {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    // Put user in the database
    const users = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${userData.name}, ${userData.email}, ${hashedPassword})
      RETURNING id, name, email, created_at
    `;
    
    return { success: true, user: users[0] };
  } catch (error: any) {
    if (error.code === '23505') { // Unique constraint violation
      return { success: false, error: 'Email već postoji' };
    }
    console.error('Database error:', error);
    return { success: false, error: 'Došlo je do greške pri registraciji' };
  }
}

export async function findUserByEmail(email: string) {
  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    
    return users[0] || null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

export async function validateUserCredentials(email: string, password: string) {
  try {
    const user = await findUserByEmail(email);
    
    if (!user) {
      return { success: false, error: 'Korisnik nije pronađen' };
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, error: 'Pogrešna lozinka' };
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Došlo je do greške pri prijavi' };
  }
}