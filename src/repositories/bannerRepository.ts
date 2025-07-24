import { prisma } from "@/lib/prisma";
import { Banner } from "@prisma/client";
import {
  BannerCreateRequest,
  BannerUpdateRequest,
  BannerResponse,
} from "@/types/banner";
import { IFilterableRepository } from "./baseRepository";
import { Id } from "@/types/utils";

export class BannerRepository
  implements
    IFilterableRepository<
      Banner,
      Record<string, unknown>,
      BannerCreateRequest,
      BannerUpdateRequest
    >
{
  async findAll(): Promise<Banner[]> {
    try {
      return await prisma.banner.findMany({
        orderBy: { sortOrder: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch banners: ${error}`);
    }
  }

  async findById(id: Id): Promise<Banner | null> {
    try {
      return await prisma.banner.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to fetch banner with id ${id}: ${error}`);
    }
  }

  async create(data: BannerCreateRequest): Promise<Banner> {
    try {
      return await prisma.banner.create({
        data: {
          title: data.title,
          imageUrl: data.imageUrl,
          linkUrl: data.linkUrl,
          sortOrder: data.sortOrder || 0,
          isActive: data.isActive ?? true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create banner: ${error}`);
    }
  }

  async update(id: Id, data: BannerUpdateRequest): Promise<Banner> {
    try {
      return await prisma.banner.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
          ...(data.linkUrl !== undefined && { linkUrl: data.linkUrl }),
          ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });
    } catch (error) {
      throw new Error(`Failed to update banner with id ${id}: ${error}`);
    }
  }

  async delete(id: Id): Promise<void> {
    try {
      await prisma.banner.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete banner with id ${id}: ${error}`);
    }
  }

  async exists(id: Id): Promise<boolean> {
    try {
      const banner = await prisma.banner.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!banner;
    } catch (error) {
      throw new Error(
        `Failed to check banner existence with id ${id}: ${error}`
      );
    }
  }

  async findByFilters(filters: Record<string, unknown>): Promise<Banner[]> {
    try {
      const where: Record<string, unknown> = {};

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters.search) {
        where.OR = [
          {
            title: { contains: filters.search as string, mode: "insensitive" },
          },
        ];
      }

      return await prisma.banner.findMany({
        where,
        orderBy: { sortOrder: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch banners with filters: ${error}`);
    }
  }

  async findWithPagination(
    page: number,
    limit: number
  ): Promise<{
    data: Banner[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const skip = page * limit;

      const [banners, total] = await Promise.all([
        prisma.banner.findMany({
          skip,
          take: limit,
          orderBy: { sortOrder: "asc" },
        }),
        prisma.banner.count(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: banners,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch banners with pagination: ${error}`);
    }
  }

  async findActive(): Promise<Banner[]> {
    try {
      return await prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch active banners: ${error}`);
    }
  }

  async toggleActive(id: Id): Promise<Banner> {
    try {
      const banner = await prisma.banner.findUnique({ where: { id } });
      if (!banner) {
        throw new Error("Banner not found");
      }

      return await prisma.banner.update({
        where: { id },
        data: { isActive: !banner.isActive },
      });
    } catch (error) {
      throw new Error(`Failed to toggle banner active status: ${error}`);
    }
  }

  async deactivateAll(): Promise<void> {
    try {
      await prisma.banner.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    } catch (error) {
      throw new Error(`Failed to deactivate all banners: ${error}`);
    }
  }

  async deactivateAllExcept(id: Id): Promise<void> {
    try {
      await prisma.banner.updateMany({
        where: {
          isActive: true,
          id: { not: id },
        },
        data: { isActive: false },
      });
    } catch (error) {
      throw new Error(
        `Failed to deactivate all banners except ${id}: ${error}`
      );
    }
  }

  toResponse(banner: Banner): BannerResponse {
    return {
      id: banner.id,
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || undefined,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
      createdAt: banner.createdAt.toISOString(),
      updatedAt: banner.updatedAt.toISOString(),
    };
  }
}
