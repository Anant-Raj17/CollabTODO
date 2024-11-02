"use client";
import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useAuth } from "@/contexts/auth-context";
import { Task, TaskInput, View } from "@/types";
import { useLists } from "@/hooks/use-lists";
import { TaskDialog } from "./task-dialog";
import { LeaderboardView } from "./leaderboard-view";
import { Button } from "./ui/button";
import { AuthDialog } from "./auth-dialog";
import { Sidebar } from "./sidebar";
import { MyListsView } from "./my-lists-view";
import { CollaborativeView } from "./collaborative-view";

export function KanbanBoardComponent() {
  const { lists, fetchLists } = useLists();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [currentList, setCurrentList] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentView, setCurrentView] = useState<View>("myTasks");
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user } = useAuth();

  const [taskInput, setTaskInput] = useState<TaskInput>({
    content: "",
    deadline: undefined,
    description: "",
    importance: 1,
  });

  const handleTaskInputChange = (input: TaskInput) => {
    setTaskInput(input);
  };

  const handleTaskAction = (listId: string, task: Task | null) => {
    setCurrentList(listId);
    setCurrentTask(task);
    if (task) {
      setTaskInput({
        content: task.content,
        deadline: task.deadline,
        description: task.description || "",
        importance: task.importance,
      });
    } else {
      setTaskInput({
        content: "",
        deadline: undefined,
        description: "",
        importance: 1,
      });
    }
    setIsTaskDialogOpen(true);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    try {
      await fetch("/api/lists/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceListId: result.source.droppableId,
          destinationListId: result.destination.droppableId,
          sourceIndex: result.source.index,
          destinationIndex: result.destination.index,
          taskId: result.draggableId,
        }),
      });

      fetchLists();
    } catch (error) {
      console.error("Error reordering task:", error);
    }
  };

  const handleDeleteTask = async (listId: string, taskId: string) => {
    try {
      await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, listId }),
      });
      fetchLists();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleTask = async (listId: string, taskId: string) => {
    try {
      const task = lists
        .find((l) => l.id === listId)
        ?.tasks.find((t) => t.id === taskId);

      if (task) {
        const response = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: taskId,
            listId: listId,
            completed: !task.completed,
            content: task.content,
            description: task.description,
            deadline: task.deadline,
            importance: task.importance,
            userId: task.userId,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        fetchLists();
      }
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  return (
    <div className="p-4">
      {!user ? (
        <div className="text-center py-8">
          <Button onClick={() => setIsAuthDialogOpen(true)}>
            Login to Continue
          </Button>
        </div>
      ) : (
        <>
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col gap-4">
              {currentView === "myTasks" && (
                <MyListsView
                  lists={lists}
                  onDeleteTask={handleDeleteTask}
                  onToggleTask={handleToggleTask}
                  onAddTask={(listId) => handleTaskAction(listId, null)}
                  onEditTask={(listId, task) => handleTaskAction(listId, task)}
                />
              )}

              {currentView === "collaborative" && (
                <CollaborativeView lists={lists} />
              )}

              {currentView === "leaderboard" && (
                <LeaderboardView lists={lists} />
              )}
            </div>
          </DragDropContext>
        </>
      )}

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setCurrentList(null);
          setCurrentTask(null);
          setTaskInput({
            content: "",
            deadline: undefined,
            description: "",
            importance: 1,
          });
        }}
        task={currentTask}
        taskInput={taskInput}
        onTaskInputChange={handleTaskInputChange}
        onSubmit={async () => {
          if (!currentList || !user) return;

          try {
            const endpoint = "/api/tasks";
            const method = currentTask ? "PUT" : "POST";

            await fetch(endpoint, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: currentTask?.id,
                content: taskInput.content,
                deadline: taskInput.deadline,
                description: taskInput.description,
                importance: taskInput.importance,
                userId: user.id,
                listId: currentList,
              }),
            });

            fetchLists();
            setIsTaskDialogOpen(false);
            setCurrentList(null);
            setCurrentTask(null);
          } catch (error) {
            console.error("Error saving task:", error);
          }
        }}
      />

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </div>
  );
}
