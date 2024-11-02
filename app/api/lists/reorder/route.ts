import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { sourceListId, destinationListId, destinationIndex, taskId } = body;

    await runTransaction(firestore, async (transaction) => {
      const taskRef = doc(firestore, "lists", sourceListId, "tasks", taskId);
      const taskDoc = await transaction.get(taskRef);
      const taskData = taskDoc.data();

      if (sourceListId !== destinationListId) {
        // Move task to new list
        await transaction.delete(taskRef);
        await transaction.set(
          doc(firestore, "lists", destinationListId, "tasks", taskId),
          { ...taskData, order: destinationIndex },
        );
      } else {
        // Update task order in same list
        await transaction.update(taskRef, { order: destinationIndex });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering task:", error);
    return NextResponse.json(
      { error: "Error reordering task" },
      { status: 500 },
    );
  }
}
