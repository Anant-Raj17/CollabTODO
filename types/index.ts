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
  listId: string;
  createdAt: Date;
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
  1: "bg-green-500 text-white",
  2: "bg-yellow-500 text-white",
  3: "bg-red-500 text-white",
} as const;

export const importanceLabels = {
  1: "Low",
  2: "Medium",
  3: "High",
} as const;

export const importancePoints = {
  1: 1,
  2: 2,
  3: 3,
} as const;
