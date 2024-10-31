import { useEffect, useState } from "react";
import { List } from "@/types";

export function useLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch("/api/lists");
      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setLoading(false);
    }
  };

  const addList = async (title: string, userId: string) => {
    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, userId }),
      });
      const newList = await response.json();
      setLists([...lists, newList]);
    } catch (error) {
      console.error("Error adding list:", error);
    }
  };

  return { lists, loading, addList, fetchLists };
}
