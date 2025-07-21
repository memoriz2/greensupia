import { TodoRepository } from "@/repositories/todoRepository";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoFilters,
} from "@/types/todo";
import { ApiResponse, TodoResponse, TodoListResponse } from "@/types/api";
import { Id } from "@/types/utils";

export class TodoService {
  private todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async getAllTodos(): Promise<ApiResponse<Todo[]>> {
    try {
      const todos = await this.todoRepository.findAll();
      return {
        success: true,
        data: todos,
        message: "Todos retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve todos: ${error}`,
      };
    }
  }

  async getTodoById(id: Id): Promise<ApiResponse<Todo>> {
    try {
      const todo = await this.todoRepository.findById(id);
      if (!todo) {
        return {
          success: false,
          error: "Todo not found",
        };
      }
      return {
        success: true,
        data: todo,
        message: "Todo retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve todo: ${error}`,
      };
    }
  }
}
