import { Priority } from "@prisma/client";

export interface Todo {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  priority: Priority;
  dueDate?: Date | null; // 추가
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date; // 추가
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: Date; // 추가: 마감일 수정 가능
}

export interface TodoFilters {
  completed?: boolean;
  priority?: Priority;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "title" | "dueDate";
  sortOrder?: "asc" | "desc";
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filters: TodoFilters;
}
