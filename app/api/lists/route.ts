import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const lists = await db.getLists();
    // Make sure we're returning valid JSON
    return NextResponse.json(lists);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Error fetching lists" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const list = await db.createList(body.title, body.userId);
    return NextResponse.json(list);
  } catch (error) {
    console.error("Operation failed:", error);
    return NextResponse.json({ error: "Error creating list" }, { status: 500 });
  }
}
