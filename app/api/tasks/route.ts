import { NextResponse } from "next/server";
import { dbOperations } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Creating task:", body);
    const task = await dbOperations.createTask({
      content: body.content,
      description: body.description,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      importance: body.importance,
      userId: body.userId,
      listId: body.listId,
      completed: false,
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error("Task creation error:", error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log("Updating task:", body);

    const task = await dbOperations.updateTask(body.id, {
      content: body.content,
      description: body.description,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      importance: body.importance,
      completed: body.completed,
      listId: body.listId,
    });

    if (body.completed) {
      const list = await dbOperations.getList(body.listId);
      if (list) {
        const newPoints = list.points + (body.importance || 1);
        await dbOperations.updateListPoints(body.listId, newPoints);
      }
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Task update error:", error);
    // Type guard to check if error is an Error object
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Error updating task", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { taskId, listId } = await request.json();
    await dbOperations.deleteTask(taskId, listId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Operation failed:", error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}
