import { firestore } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { List, Task } from "@/types";

export const dbOperations = {
  // List operations
  async getLists() {
    const listsSnapshot = await getDocs(collection(firestore, "lists"));
    const lists: List[] = [];

    for (const listDoc of listsSnapshot.docs) {
      const tasksSnapshot = await getDocs(
        collection(firestore, "lists", listDoc.id, "tasks"),
      );

      const tasks = tasksSnapshot.docs.map((taskDoc) => ({
        id: taskDoc.id,
        ...taskDoc.data(),
        completed: taskDoc.data().completed || false,
      })) as Task[];

      lists.push({
        id: listDoc.id,
        ...listDoc.data(),
        tasks,
      } as List);
    }

    return lists;
  },

  async getList(listId: string) {
    try {
      const listDoc = await getDoc(doc(firestore, "lists", listId));
      if (!listDoc.exists()) return null;

      const tasksSnapshot = await getDocs(
        collection(firestore, "lists", listId, "tasks"),
      );

      const tasks = tasksSnapshot.docs.map((taskDoc) => ({
        id: taskDoc.id,
        ...taskDoc.data(),
        completed: taskDoc.data().completed || false,
      })) as Task[];

      return {
        id: listDoc.id,
        ...listDoc.data(),
        tasks,
      } as List;
    } catch (error) {
      console.error("Error getting list from Firestore:", error);
      throw error;
    }
  },

  async createTask(data: {
    content: string;
    description?: string;
    deadline?: Date;
    importance: number;
    userId: string;
    listId: string;
    completed: boolean;
  }) {
    try {
      const taskRef = await addDoc(
        collection(firestore, "lists", data.listId, "tasks"),
        {
          ...data,
          deadline: data.deadline?.toISOString() || null,
          createdAt: new Date().toISOString(),
          completed: false,
        },
      );

      return {
        id: taskRef.id,
        ...data,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async updateTask(
    taskId: string,
    data: {
      content?: string;
      description?: string;
      deadline?: Date;
      completed?: boolean;
      importance?: number;
      listId: string;
    },
  ) {
    try {
      const taskRef = doc(firestore, "lists", data.listId, "tasks", taskId);
      const updateData = {
        ...data,
        deadline: data.deadline?.toISOString(),
      };

      await updateDoc(taskRef, updateData);
      return { id: taskId, ...data };
    } catch (error) {
      console.error("Error updating task in Firestore:", error);
      throw error;
    }
  },

  async deleteTask(taskId: string, listId: string) {
    await deleteDoc(doc(firestore, "lists", listId, "tasks", taskId));
    return true;
  },

  async updateListPoints(listId: string, points: number) {
    try {
      const listRef = doc(firestore, "lists", listId);
      await updateDoc(listRef, { points });
      return { id: listId, points };
    } catch (error) {
      console.error("Error updating list points in Firestore:", error);
      throw error;
    }
  },
};
