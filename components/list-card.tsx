"use client";

import { List, Task } from "@/types";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { TaskCard } from "./task-card";
import { Droppable, Draggable } from "@hello-pangea/dnd";

interface ListCardProps {
  list: List;
  canEdit: boolean;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
}

export function ListCard({
  list,
  canEdit,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
}: ListCardProps) {
  // Sort tasks function
  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      // First, sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then by importance (high to low)
      if (a.importance !== b.importance) {
        return b.importance - a.importance;
      }

      // Then by deadline
      const aDate = a.deadline ? new Date(a.deadline) : null;
      const bDate = b.deadline ? new Date(b.deadline) : null;

      if (aDate && bDate) {
        return aDate.getTime() - bDate.getTime();
      } else if (aDate) {
        return -1; // Tasks with deadlines come first
      } else if (bDate) {
        return 1;
      }

      // Finally by creation date
      const aCreated = new Date(a.createdAt);
      const bCreated = new Date(b.createdAt);
      return aCreated.getTime() - bCreated.getTime();
    });
  };

  const sortedTasks = sortTasks(list.tasks);

  return (
    <Card className="w-80 shrink-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {list.title}
          <div className="text-xs text-muted-foreground">
            Points: {list.points}
          </div>
        </CardTitle>
        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={onAddTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border">
          <Droppable droppableId={list.id} type="TASK">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="p-4 space-y-4"
              >
                {sortedTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard
                          task={task}
                          canEdit={canEdit}
                          onEdit={() => onEditTask(task)}
                          onDelete={() => onDeleteTask(task.id)}
                          onToggleComplete={() => onToggleTask(task.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
