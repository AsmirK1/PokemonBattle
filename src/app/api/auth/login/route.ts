import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { emailOrUsername, password } = await req.json();

    if (!emailOrUsername || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    // find user by email or username
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR name = $1 LIMIT 1",
      [emailOrUsername]
    );

    if (userQuery.rows.length === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const user = userQuery.rows[0];

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // return user without password
    const { password: _, ...userData } = user;

    return NextResponse.json({ success: true, user: userData }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}