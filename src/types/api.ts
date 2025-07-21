import { Todo } from "./todo";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type TodoResponse = ApiResponse<Todo>;
export type TodoListResponse = ApiResponse<Todo[]>;
export type PaginatedTodoResponse = ApiResponse<PaginatedResponse<Todo>>;
