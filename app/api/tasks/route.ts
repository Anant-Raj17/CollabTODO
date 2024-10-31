import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = await db.createTask(body);
    return NextResponse.json(task);
  } catch (error) {
    console.error("Operation failed:", error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const task = await db.updateTask(body.id, body);
    return NextResponse.json(task);
  } catch (error) {
    console.error("Operation failed:", error);
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { taskId } = await request.json();
    await db.deleteTask(taskId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Operation failed:", error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}
