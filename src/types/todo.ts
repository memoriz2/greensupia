import { Priority } from "@prisma/client";

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: Priority;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
}

export interface TodoFilters {
  completed?: boolean;
  priority?: Priority;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "title";
  sortOrder?: "asc" | "desc";
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filters: TodoFilters;
}
