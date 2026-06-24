import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const {
      account_number,
      plan_id,
      status,
    } = await request.json();

    await pool.query(
      `
      UPDATE licenses
      SET
        account_number = ?,
        plan_id = ?,
        status = ?
      WHERE id = ?
      `,
      [
        account_number,
        plan_id,
        status,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    await pool.query(
      `
      DELETE FROM licenses
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}