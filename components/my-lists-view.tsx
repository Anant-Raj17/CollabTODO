"use client";

import { useAuth } from "@/contexts/auth-context";
import { List, Task } from "@/types";
import { ListCard } from "./list-card";

interface MyListsViewProps {
  lists: List[];
  onDeleteTask: (listId: string, taskId: string) => Promise<void>;
  onToggleTask: (listId: string, taskId: string) => Promise<void>;
  onAddTask: (listId: string) => void;
  onEditTask: (listId: string, task: Task) => void;
}

export function MyListsView({
  lists,
  onDeleteTask,
  onToggleTask,
  onAddTask,
  onEditTask,
}: MyListsViewProps) {
  const { user } = useAuth();

  const userList = lists.find((list) => list.userId === user?.id) || {
    id: user?.id || "",
    title: user?.username || "",
    tasks: [],
    points: 0,
    userId: user?.id || "",
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto pb-4">
        <ListCard
          key={userList.id}
          list={userList}
          canEdit={true}
          onAddTask={() => onAddTask(userList.id)}
          onEditTask={(task) => onEditTask(userList.id, task)}
          onDeleteTask={(taskId) => onDeleteTask(userList.id, taskId)}
          onToggleTask={(taskId) => onToggleTask(userList.id, taskId)}
        />
      </div>
    </div>
  );
}
