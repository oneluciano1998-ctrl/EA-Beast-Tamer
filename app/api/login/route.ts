import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(
  req: NextRequest
) {
  try {
    const {
      email,
      password,
    } = await req.json();

    const [users] =
      await pool.query<RowDataPacket[]>(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [email]
      );

    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message:
          "Email not found",
      });
    }

    const user = users[0];

    const isMatch =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!isMatch) {
      return NextResponse.json({
        success: false,
        message:
          "Invalid password",
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        role_id: user.role_id,
        email: user.email,
        full_name:
          user.full_name,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message:
        "Server error",
    });
  }
}
