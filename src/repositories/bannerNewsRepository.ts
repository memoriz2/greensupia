import { prisma } from "@/lib/prisma";
import {
  BannerNews,
  CreateBannerNewsRequest,
  UpdateBannerNewsRequest,
  BannerNewsFilters,
} from "@/types/bannerNews";
import { IFilterableRepository } from "./baseRepository";
import { Id } from "@/types/utils";

export class BannerNewsRepository
  implements
    IFilterableRepository<
      BannerNews,
      BannerNewsFilters,
      CreateBannerNewsRequest,
      UpdateBannerNewsRequest
    >
{
  async findAll(): Promise<BannerNews[]> {
    try {
      return await prisma.bannerNews.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch banner news: ${error}`);
    }
  }

  async findById(id: Id): Promise<BannerNews | null> {
    try {
      return await prisma.bannerNews.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to fetch banner news with id ${id}: ${error}`);
    }
  }

  async create(data: CreateBannerNewsRequest): Promise<BannerNews> {
    try {
      return await prisma.bannerNews.create({
        data: {
          ...data,
          isActive: data.isActive ?? true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create banner news: ${error}`);
    }
  }

  async update(id: Id, data: UpdateBannerNewsRequest): Promise<BannerNews> {
    try {
      return await prisma.bannerNews.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update banner news with id ${id}: ${error}`);
    }
  }

  async delete(id: Id): Promise<void> {
    try {
      await prisma.bannerNews.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete banner news with id ${id}: ${error}`);
    }
  }

  async exists(id: Id): Promise<boolean> {
    try {
      const bannerNews = await prisma.bannerNews.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!bannerNews;
    } catch (error) {
      throw new Error(
        `Failed to check banner news existence with id ${id}: ${error}`
      );
    }
  }

  async findByFilters(filters: BannerNewsFilters): Promise<BannerNews[]> {
    try {
      const where: Record<string, unknown> = {};

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { content: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      let orderBy: { [key: string]: "asc" | "desc" } = { createdAt: "desc" };
      if (filters.sortBy) {
        orderBy = { [filters.sortBy]: filters.sortOrder || "desc" };
      }

      return await prisma.bannerNews.findMany({
        where,
        orderBy,
      });
    } catch (error) {
      throw new Error(`Failed to fetch banner news with filters: ${error}`);
    }
  }

  async findActive(): Promise<BannerNews[]> {
    try {
      return await prisma.bannerNews.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch active banner news: ${error}`);
    }
  }
}
