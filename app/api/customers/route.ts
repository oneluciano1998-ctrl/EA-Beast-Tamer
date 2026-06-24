import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT
        users.id,
        users.full_name,
        users.email,
        users.status,
        roles.name AS role
      FROM users
      LEFT JOIN roles
      ON users.role_id = roles.id
      ORDER BY users.id DESC
    `);

    return NextResponse.json({
      success: true,
      customers: rows,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Failed to load customers",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      full_name,
      email,
      password_hash,
      role_id,
      status,
    } = body;

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
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        role_id,
        email,
        password_hash,
        full_name,
        status,
      ]
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}