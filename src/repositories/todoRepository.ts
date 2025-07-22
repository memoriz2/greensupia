import { prisma } from "@/lib/prisma";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoFilters,
} from "@/types/todo";
import { IFilterableRepository } from "./baseRepository";
import { Id } from "@/types/utils";

export class TodoRepository
  implements
    IFilterableRepository<
      Todo,
      TodoFilters,
      CreateTodoRequest,
      UpdateTodoRequest
    >
{
  async findAll(): Promise<Todo[]> {
    try {
      return await prisma.todo.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch todos: ${error}`);
    }
  }

  async findById(id: Id): Promise<Todo | null> {
    try {
      return await prisma.todo.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to fetch todo with id ${id}: ${error}`);
    }
  }

  async create(data: CreateTodoRequest): Promise<Todo> {
    try {
      const createData: Record<string, unknown> = {
        title: data.title,
        description: data.description,
        priority: data.priority || "MEDIUM",
      };

      if (data.dueDate) {
        createData.dueDate = data.dueDate;
      }

      return await prisma.todo.create({
        data: createData as Parameters<typeof prisma.todo.create>[0]["data"],
      });
    } catch (error) {
      throw new Error(`Failed to create todo: ${error}`);
    }
  }

  async update(id: Id, data: UpdateTodoRequest): Promise<Todo> {
    try {
      return await prisma.todo.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update todo with id ${id}: ${error}`);
    }
  }

  async delete(id: Id): Promise<void> {
    try {
      await prisma.todo.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete todo with id ${id}: ${error}`);
    }
  }

  async exists(id: Id): Promise<boolean> {
    try {
      const todo = await prisma.todo.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!todo;
    } catch (error) {
      throw new Error(`Failed to check todo existence with id ${id}: ${error}`);
    }
  }

  async findByFilters(filters: TodoFilters): Promise<Todo[]> {
    try {
      const where: Record<string, unknown> = {};

      if (filters.completed !== undefined) {
        where.completed = filters.completed;
      }

      if (filters.priority) {
        where.priority = filters.priority;
      }

      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      let orderBy: { [key: string]: "asc" | "desc" } = { createdAt: "desc" };
      if (filters.sortBy) {
        orderBy = { [filters.sortBy]: filters.sortOrder || "desc" };
      }
      return await prisma.todo.findMany({
        where,
        orderBy,
      });
    } catch (error) {
      throw new Error(`Failed to fetch todos with filters: ${error}`);
    }
  }
}
