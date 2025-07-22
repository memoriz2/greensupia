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

  async createTodo(data: CreateTodoRequest): Promise<ApiResponse<Todo>> {
    try {
      const todo = await this.todoRepository.create(data);
      return {
        success: true,
        data: todo,
        message: "Todo created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create todo: ${error}`,
      };
    }
  }

  async updateTodo(
    id: Id,
    data: UpdateTodoRequest
  ): Promise<ApiResponse<Todo>> {
    try {
      const existingTodo = await this.todoRepository.findById(id);
      if (!existingTodo) {
        return {
          success: false,
          error: "Todo not found",
        };
      }

      const updatedTodo = await this.todoRepository.update(id, data);
      return {
        success: true,
        data: updatedTodo,
        message: "Todo updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update todo: ${error}`,
      };
    }
  }

  async deleteTodo(id: Id): Promise<ApiResponse<boolean>> {
    try {
      const existingTodo = await this.todoRepository.findById(id);
      if (!existingTodo) {
        return {
          success: false,
          error: "Todo not found",
        };
      }

      await this.todoRepository.delete(id);
      return {
        success: true,
        data: true,
        message: "Todo deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete todo: ${error}`,
      };
    }
  }

  async getTodoByFilters(filters: TodoFilters): Promise<ApiResponse<Todo[]>> {
    try {
      const todos = await this.todoRepository.findByFilters(filters);
      return {
        success: true,
        data: todos,
        message: `Found ${todos.length} todos matching filters`,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve todos with filters: ${error}`,
      };
    }
  }

  async toggleTodoComplete(id: Id): Promise<ApiResponse<Todo>> {
    try {
      const existingTodo = await this.todoRepository.findById(id);
      if (!existingTodo) {
        return {
          success: false,
          error: "Todo not found",
        };
      }

      const updatedTodo = await this.todoRepository.update(id, {
        completed: !existingTodo.completed,
      });

      return {
        success: true,
        data: updatedTodo,
        message: `Todo ${
          updatedTodo.completed ? "completed" : "uncompleted"
        } successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to toggle todo completion: ${error}`,
      };
    }
  }

  async getTodoStates(): Promise<
    ApiResponse<{
      total: number;
      completed: number;
      pending: number;
      completionRate: number;
      priorityStats: {
        low: number;
        medium: number;
        high: number;
      };
    }>
  > {
    try {
      const allTodos = await this.todoRepository.findAll();

      const total = allTodos.length;
      const completed = allTodos.filter((todo) => todo.completed).length;
      const pending = total - completed;
      const completionRate =
        total > 0 ? Math.round((completed / total) * 100) : 0;

      const priorityStats = {
        low: allTodos.filter((todo) => todo.priority === "LOW").length,
        medium: allTodos.filter((todo) => todo.priority === "MEDIUM").length,
        high: allTodos.filter((todo) => todo.priority === "HIGH").length,
      };

      return {
        success: true,
        data: {
          total,
          completed,
          pending,
          completionRate,
          priorityStats,
        },
        message: `Todo statistics retrieved successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve todo statistics: ${error}`,
      };
    }
  }
}
