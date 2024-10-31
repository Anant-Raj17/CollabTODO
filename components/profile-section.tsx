"use client";

import { useRef } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"; // You'll need to add this UI component
import { useAuth } from "@/contexts/auth-context";

export function ProfileSection() {
  const { user, updateProfilePicture } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/users/profile-picture", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        updateProfilePicture(data.imageUrl);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
      <Button
        variant="ghost"
        className="relative h-20 w-20 rounded-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <Avatar className="h-20 w-20">
          {user?.profilePicture ? (
            <AvatarImage src={user.profilePicture} alt={user.username} />
          ) : (
            <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
      </Button>
      <div className="text-center">
        <h3 className="font-medium">{user?.username}</h3>
      </div>
    </div>
  );
}
