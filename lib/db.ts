import { prisma } from "./prisma";
//import { Task } from "@/types";

export const db = {
  // List operations
  async getLists() {
    return prisma.list.findMany({
      include: {
        tasks: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  },

  async createList(title: string, userId: string) {
    return prisma.list.create({
      data: {
        title,
        userId,
      },
      include: {
        tasks: true,
      },
    });
  },

  // Task operations
  async createTask(data: {
    content: string;
    description?: string;
    deadline?: Date;
    importance: number;
    userId: string;
    listId: string;
  }) {
    return prisma.task.create({
      data,
    });
  },

  async updateTask(
    taskId: string,
    data: {
      content?: string;
      description?: string;
      deadline?: Date;
      completed?: boolean;
      importance?: number;
    },
  ) {
    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  },

  async deleteTask(taskId: string) {
    return prisma.task.delete({
      where: { id: taskId },
    });
  },

  async updateListPoints(listId: string, points: number) {
    return prisma.list.update({
      where: { id: listId },
      data: { points },
    });
  },
};
