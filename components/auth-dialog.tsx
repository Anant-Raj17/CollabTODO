"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@/contexts/auth-context";

export function AuthDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, signup } = useAuth();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await signup(username, password);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLogin ? "Login" : "Sign Up"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleSubmit} className="w-full">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full"
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
