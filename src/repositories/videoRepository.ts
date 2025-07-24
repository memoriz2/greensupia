import { prisma } from "@/lib/prisma";
import { Video } from "@prisma/client";
import {
  VideoCreateRequest,
  VideoUpdateRequest,
  VideoResponse,
} from "@/types/video";
import { IFilterableRepository } from "./baseRepository";
import { Id } from "@/types/utils";

export class VideoRepository
  implements
    IFilterableRepository<
      Video,
      Record<string, unknown>,
      VideoCreateRequest,
      VideoUpdateRequest
    >
{
  async findAll(): Promise<Video[]> {
    try {
      return await prisma.video.findMany({
        orderBy: { sortOrder: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch videos: ${error}`);
    }
  }

  async findById(id: Id): Promise<Video | null> {
    try {
      return await prisma.video.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to fetch video with id ${id}: ${error}`);
    }
  }

  async create(data: VideoCreateRequest): Promise<Video> {
    try {
      return await prisma.video.create({
        data: {
          title: data.title,
          description: data.description,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          duration: data.duration,
          sortOrder: data.sortOrder || 0,
          isActive: data.isActive ?? true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create video: ${error}`);
    }
  }

  async update(id: Id, data: VideoUpdateRequest): Promise<Video> {
    try {
      return await prisma.video.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
          ...(data.thumbnailUrl !== undefined && {
            thumbnailUrl: data.thumbnailUrl,
          }),
          ...(data.duration !== undefined && { duration: data.duration }),
          ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });
    } catch (error) {
      throw new Error(`Failed to update video with id ${id}: ${error}`);
    }
  }

  async delete(id: Id): Promise<void> {
    try {
      await prisma.video.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete video with id ${id}: ${error}`);
    }
  }

  async exists(id: Id): Promise<boolean> {
    try {
      const video = await prisma.video.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!video;
    } catch (error) {
      throw new Error(
        `Failed to check video existence with id ${id}: ${error}`
      );
    }
  }

  async findByFilters(filters: Record<string, unknown>): Promise<Video[]> {
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
          {
            description: {
              contains: filters.search as string,
              mode: "insensitive",
            },
          },
        ];
      }

      return await prisma.video.findMany({
        where,
        orderBy: { sortOrder: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch videos with filters: ${error}`);
    }
  }

  async findWithPagination(
    page: number,
    limit: number
  ): Promise<{
    data: Video[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const skip = page * limit;

      const [videos, total] = await Promise.all([
        prisma.video.findMany({
          skip,
          take: limit,
          orderBy: { sortOrder: "asc" },
        }),
        prisma.video.count(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: videos,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch videos with pagination: ${error}`);
    }
  }

  async findActive(): Promise<Video[]> {
    try {
      return await prisma.video.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch active videos: ${error}`);
    }
  }

  async toggleActive(id: Id): Promise<Video> {
    try {
      const video = await prisma.video.findUnique({ where: { id } });
      if (!video) {
        throw new Error("Video not found");
      }

      return await prisma.video.update({
        where: { id },
        data: { isActive: !video.isActive },
      });
    } catch (error) {
      throw new Error(`Failed to toggle video active status: ${error}`);
    }
  }

  async deactivateAll(): Promise<void> {
    try {
      await prisma.video.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    } catch (error) {
      throw new Error(`Failed to deactivate all videos: ${error}`);
    }
  }

  async deactivateAllExcept(id: Id): Promise<void> {
    try {
      await prisma.video.updateMany({
        where: {
          isActive: true,
          id: { not: id },
        },
        data: { isActive: false },
      });
    } catch (error) {
      throw new Error(`Failed to deactivate all videos except ${id}: ${error}`);
    }
  }

  toResponse(video: Video): VideoResponse {
    return {
      id: video.id,
      title: video.title,
      description: video.description || undefined,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || undefined,
      duration: video.duration || undefined,
      sortOrder: video.sortOrder,
      isActive: video.isActive,
      createdAt: video.createdAt.toISOString(),
      updatedAt: video.updatedAt.toISOString(),
    };
  }
}
