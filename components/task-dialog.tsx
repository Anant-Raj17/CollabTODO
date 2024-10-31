"use client";

import {
  Task,
  TaskImportance,
  TaskInput,
  importanceColors,
  importanceLabels,
} from "@/types";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  taskInput: TaskInput;
  onTaskInputChange: (input: TaskInput) => void;
  onSubmit: () => void;
}

export function TaskDialog({
  isOpen,
  onClose,
  task,
  taskInput,
  onTaskInputChange,
  onSubmit,
}: TaskDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Task name"
            value={taskInput.content}
            onChange={(e) =>
              onTaskInputChange({ ...taskInput, content: e.target.value })
            }
          />
          <div className="flex items-center space-x-2">
            <span>Deadline:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {taskInput.deadline
                    ? format(taskInput.deadline, "PP")
                    : "Set date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={taskInput.deadline}
                  onSelect={(date) =>
                    onTaskInputChange({ ...taskInput, deadline: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Select
            value={taskInput.importance.toString()}
            onValueChange={(value) =>
              onTaskInputChange({
                ...taskInput,
                importance: parseInt(value) as TaskImportance,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select importance" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3].map((level) => (
                <SelectItem key={level} value={level.toString()}>
                  <div className="flex items-center">
                    <Badge
                      className={`mr-2 ${importanceColors[level as TaskImportance]}`}
                    >
                      {importanceLabels[level as TaskImportance]}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Task description"
            value={taskInput.description}
            onChange={(e) =>
              onTaskInputChange({ ...taskInput, description: e.target.value })
            }
          />
          <Button onClick={onSubmit}>
            {task ? "Update Task" : "Add Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
