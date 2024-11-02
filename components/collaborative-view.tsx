"use client";

import { useAuth } from "@/contexts/auth-context";
import { List } from "@/types";
import { ListCard } from "./list-card";

interface CollaborativeViewProps {
  lists: List[];
}

export function CollaborativeView({ lists }: CollaborativeViewProps) {
  const { user } = useAuth();
  const otherUsersLists = lists.filter((list) => list.userId !== user?.id);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Collaborative View</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {otherUsersLists.length > 0 ? (
          otherUsersLists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              canEdit={false}
              onAddTask={() => {}}
              onEditTask={() => {}}
              onDeleteTask={() => {}}
              onToggleTask={() => {}}
            />
          ))
        ) : (
          <div className="text-center w-full py-8 text-gray-500">
            No other users&apos; lists to display
          </div>
        )}
      </div>
    </div>
  );
}
