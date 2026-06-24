import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [users] =
      await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as total FROM users"
      );

    const [licenses] =
      await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as total FROM licenses"
      );

    const [payments] =
      await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as total FROM payments"
      );

    const [plans] =
      await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as total FROM plans"
      );

    return NextResponse.json({
      success: true,
      users: users[0].total,
      licenses: licenses[0].total,
      payments: payments[0].total,
      plans: plans[0].total,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
    });
  }
}