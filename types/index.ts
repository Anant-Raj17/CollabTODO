export type TaskImportance = 1 | 2 | 3;

export type TaskInput = {
  content: string;
  deadline: Date | undefined;
  description: string;
  importance: TaskImportance;
};

export type Task = {
  id: string;
  content: string;
  deadline?: Date;
  description?: string;
  completed: boolean;
  importance: TaskImportance;
  userId: string;
};

export type List = {
  id: string;
  title: string;
  tasks: Task[];
  points: number;
  userId: string;
};

export type View = "collaborative" | "myTasks" | "leaderboard";

export const importanceColors = {
  1: "bg-green-500",
  2: "bg-yellow-500",
  3: "bg-red-500",
};

export const importanceLabels = {
  1: "Low",
  2: "Medium",
  3: "High",
};

export const importancePoints = {
  1: 1,
  2: 2,
  3: 3,
};
