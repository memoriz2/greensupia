import { useState, useCallback } from "react";
import { Todo } from "@/types/todo";
import { ERROR_MESSAGES } from "@/config/constants";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/todos");
      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      const data = await response.json();
      setTodos(
        data.map((todo: Record<string, unknown>) => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate as string) : null,
          createdAt: new Date(todo.createdAt as string),
          updatedAt: new Date(todo.updatedAt as string),
        }))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(
    async (todoData: Omit<Todo, "id" | "createdAt" | "updatedAt">) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(todoData),
        });
        if (!response.ok) {
          throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }
        const newTodo = await response.json();
        setTodos((prev) => [
          ...prev,
          {
            ...newTodo,
            dueDate: newTodo.dueDate ? new Date(newTodo.dueDate) : null,
            createdAt: new Date(newTodo.createdAt),
            updatedAt: new Date(newTodo.updatedAt),
          },
        ]);
        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const toggleTodo = useCallback(async (todoId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/todos/${todoId}/toggle`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        )
      );
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    toggleTodo,
  };
};
