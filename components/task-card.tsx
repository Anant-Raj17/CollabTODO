import { Task, importanceColors, importanceLabels } from "@/types";
import { format } from "date-fns";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

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
  return (
    <Card className={`${task.completed ? "opacity-50" : ""}`}>
      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={onToggleComplete}
              disabled={!canEdit}
            />
            <span className={task.completed ? "line-through" : ""}>
              {task.content}
            </span>
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
            <div className="text-xs text-muted-foreground">
              Due: {format(task.deadline, "PP")}
            </div>
          )}
          <Badge className={importanceColors[task.importance]}>
            {importanceLabels[task.importance]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
