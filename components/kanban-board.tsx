"use client";
import {
  useState,
  //useEffect
} from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useAuth } from "@/contexts/auth-context";
import {
  //List,
  Task,
  TaskInput,
  View,
} from "@/types";
import { useLists } from "@/hooks/use-lists";
import { ListCard } from "./list-card";
import { TaskDialog } from "./task-dialog";
import { LeaderboardView } from "./leaderboard-view";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Plus } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export function KanbanBoardComponent() {
  const {
    lists,
    //loading,
    //addList,
    fetchLists,
  } = useLists();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddListDialogOpen, setIsAddListDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [currentList, setCurrentList] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentView] = useState<View>("collaborative");
  const [, setIsAuthDialogOpen] = useState(false);
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
        body: JSON.stringify({ taskId }),
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
        await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: taskId,
            completed: !task.completed,
          }),
        });
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
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Input
                type="text"
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <Dialog
                open={isAddListDialogOpen}
                onOpenChange={setIsAddListDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add List
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <ScrollArea className="h-[calc(100vh-8rem)]">
              {currentView === "collaborative" && (
                <div className="flex gap-4">
                  {lists.map((list) => (
                    <ListCard
                      key={list.id}
                      list={list}
                      canEdit={user.id === list.userId}
                      onAddTask={() => {
                        setCurrentList(list.id);
                        setCurrentTask(null);
                        setIsTaskDialogOpen(true);
                      }}
                      onEditTask={(task) => {
                        setCurrentList(list.id);
                        setCurrentTask(task);
                        setTaskInput({
                          content: task.content,
                          deadline: task.deadline,
                          description: task.description || "",
                          importance: task.importance,
                        });
                        setIsTaskDialogOpen(true);
                      }}
                      onDeleteTask={(taskId) =>
                        handleDeleteTask(list.id, taskId)
                      }
                      onToggleTask={(taskId) =>
                        handleToggleTask(list.id, taskId)
                      }
                    />
                  ))}
                </div>
              )}

              {currentView === "leaderboard" && (
                <LeaderboardView lists={lists} />
              )}
            </ScrollArea>
          </div>
        </DragDropContext>
      )}

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        task={currentTask}
        taskInput={taskInput}
        onTaskInputChange={handleTaskInputChange}
        onSubmit={async () => {
          if (!currentList || !user) return;

          try {
            const endpoint = currentTask ? "/api/tasks" : "/api/tasks";
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
          } catch (error) {
            console.error("Error saving task:", error);
          }
        }}
      />
    </div>
  );
}
