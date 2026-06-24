import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } =
      await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const [existingUsers] =
    await pool.query<RowDataPacket[]>(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO users
      (
        role_id,
        email,
        password_hash,
        full_name,
        status
      )
      VALUES
      (
        4,
        ?,
        ?,
        ?,
        'active'
      )
      `,
      [
        email,
        hashedPassword,
        username,
      ]
    );

    return NextResponse.json({
      success: true,
      message:
        "Account created successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}