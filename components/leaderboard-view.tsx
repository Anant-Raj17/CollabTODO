"use client";

import { List } from "@/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState } from "react";

interface LeaderboardViewProps {
  lists: List[];
}

export function LeaderboardView({ lists }: LeaderboardViewProps) {
  const [sortedLists, setSortedLists] = useState<List[]>([]);

  useEffect(() => {
    setSortedLists([...lists].sort((a, b) => b.points - a.points));
  }, [lists]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border">
          <div className="p-4">
            {sortedLists.map((list, index) => (
              <div
                key={list.id}
                className={cn(
                  "flex justify-between items-center py-2 border-b last:border-b-0",
                  {
                    "border-2 border-yellow-400": index === 0,
                    "border-2 border-gray-400": index === 1,
                    "border-2 border-amber-700": index === 2,
                  },
                )}
              >
                <span
                  className={cn("font-medium", {
                    "text-yellow-400": index === 0,
                    "text-gray-400": index === 1,
                    "text-amber-700": index === 2,
                  })}
                >
                  {index + 1}. {list.title}
                </span>
                <span>{list.points} points</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
