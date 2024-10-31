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
                {list.tasks.map((task, index) => (
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
