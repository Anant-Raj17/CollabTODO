"use client";

import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { List, LayoutGrid, Trophy, LogOut } from "lucide-react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: "myTasks" | "collaborative" | "leaderboard") => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full absolute top-4 right-4"
        >
          <Avatar>
            {user.profilePicture ? (
              <AvatarImage src={user.profilePicture} alt={user.username} />
            ) : (
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 mt-8">
          <div className="flex flex-col items-center space-y-2 mb-8">
            <Avatar className="h-20 w-20">
              {user.profilePicture ? (
                <AvatarImage src={user.profilePicture} alt={user.username} />
              ) : (
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="font-medium">{user.username}</span>
          </div>

          <Button
            variant={currentView === "myTasks" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("myTasks")}
          >
            <List className="mr-2 h-4 w-4" />
            My Lists
          </Button>

          <Button
            variant={currentView === "collaborative" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("collaborative")}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Collaborative View
          </Button>

          <Button
            variant={currentView === "leaderboard" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("leaderboard")}
          >
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
