import { NextResponse } from "next/server";
import { dbOperations } from "@/lib/db";

export async function GET() {
  try {
    const lists = await dbOperations.getLists();
    return NextResponse.json(lists);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Error fetching lists" },
      { status: 500 },
    );
  }
}
