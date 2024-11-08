import { Task, importanceColors, importanceLabels } from "@/types";
import { format, isPast } from "date-fns";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export function TaskCard({
  task,
  canEdit,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskCardProps) {
  const isOverdue =
    task.deadline && !task.completed && isPast(new Date(task.deadline));

  return (
    <Card
      className={cn(
        task.completed ? "opacity-50" : "",
        isOverdue ? "border-red-500" : "",
      )}
    >
      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={onToggleComplete}
              disabled={!canEdit}
            />
            <div>
              <span className={task.completed ? "line-through" : ""}>
                {task.content}
              </span>
              {isOverdue && (
                <span className="text-xs text-red-500 ml-2">Overdue</span>
              )}
            </div>
          </div>
          {canEdit && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={onEdit}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={onDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          {task.deadline && (
            <div
              className={cn(
                "text-xs",
                isOverdue ? "text-red-500" : "text-muted-foreground",
              )}
            >
              Due: {format(new Date(task.deadline), "PP")}
            </div>
          )}
          <Badge className={importanceColors[task.importance]}>
            {importanceLabels[task.importance]}
          </Badge>
        </div>
        {task.description && (
          <div className="text-xs text-muted-foreground mt-2">
            {task.description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
