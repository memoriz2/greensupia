import { prisma } from "@/lib/prisma";
import {
  History,
  CreateHistoryRequest,
  UpdateHistoryRequest,
  HistoryFilters,
} from "@/types/history";
import { IFilterableRepository } from "./baseRepository";
import { Id } from "@/types/utils";

export class HistoryRepository
  implements
    IFilterableRepository<
      History,
      HistoryFilters,
      CreateHistoryRequest,
      UpdateHistoryRequest
    >
{
  async findAll(): Promise<History[]> {
    try {
      return await prisma.history.findMany({
        orderBy: { year: "desc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch histories: ${error}`);
    }
  }

  async findById(id: Id): Promise<History | null> {
    try {
      return await prisma.history.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to fetch history with id ${id}: ${error}`);
    }
  }

  async create(data: CreateHistoryRequest): Promise<History> {
    try {
      return await prisma.history.create({
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new Error(`Failed to create history: ${error}`);
    }
  }

  async update(id: Id, data: UpdateHistoryRequest): Promise<History> {
    try {
      return await prisma.history.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update history with id ${id}: ${error}`);
    }
  }

  async delete(id: Id): Promise<void> {
    try {
      await prisma.history.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete history with id ${id}: ${error}`);
    }
  }

  async exists(id: Id): Promise<boolean> {
    try {
      const history = await prisma.history.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!history;
    } catch (error) {
      throw new Error(
        `Failed to check history existence with id ${id}: ${error}`
      );
    }
  }

  async findByFilters(filters: HistoryFilters): Promise<History[]> {
    try {
      const where: Record<string, unknown> = {};

      if (filters.year !== undefined) {
        where.year = filters.year;
      }

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters.search) {
        where.OR = [
          { description: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      let orderBy: { [key: string]: "asc" | "desc" } = { sortOrder: "asc" };
      if (filters.sortBy) {
        orderBy = { [filters.sortBy]: filters.sortOrder || "desc" };
      }

      return await prisma.history.findMany({
        where,
        orderBy,
      });
    } catch (error) {
      throw new Error(`Failed to fetch histories with filters: ${error}`);
    }
  }

  async findByYearRange(
    startYear: string,
    endYear: string
  ): Promise<History[]> {
    try {
      return await prisma.history.findMany({
        where: {
          year: {
            gte: startYear,
            lte: endYear,
          },
        },
        orderBy: { sortOrder: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch histories by year range: ${error}`);
    }
  }
}
