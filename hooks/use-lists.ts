import { useEffect, useState } from "react";
import { List } from "@/types";

export function useLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = async () => {
    try {
      const response = await fetch("/api/lists");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLists(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching lists:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch lists",
      );
      setLists([]); // Reset lists on error
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newList = await response.json();
      setLists((prevLists) => [...prevLists, newList]);
      setError(null);
    } catch (error) {
      console.error("Error adding list:", error);
      setError(error instanceof Error ? error.message : "Failed to add list");
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return {
    lists,
    loading,
    error,
    addList,
    fetchLists,
  };
}
