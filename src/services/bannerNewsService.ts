import { bannerNewsRepository } from "@/repositories/bannerNewsRepository";
import {
  BannerNews,
  CreateBannerNewsRequest,
  UpdateBannerNewsRequest,
  BannerNewsFilters,
} from "@/types/bannerNews";
import { ApiResponse } from "@/types/api";
import { Id } from "@/types/utils";

export class BannerNewsService {
  private bannerNewsRepository: bannerNewsRepository;

  constructor() {
    this.bannerNewsRepository = new bannerNewsRepository();
  }

  async getAllBannerNews(): Promise<ApiResponse<BannerNews[]>> {
    try {
      const bannerNews = await this.bannerNewsRepository.findAll();
      return {
        success: true,
        data: bannerNews,
        message: "Banner news retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve banner news: ${error}`,
      };
    }
  }

  async getBannerNewsById(id: Id): Promise<ApiResponse<BannerNews>> {
    try {
      const bannerNews = await this.bannerNewsRepository.findById(id);
      if (!bannerNews) {
        return {
          success: false,
          error: "Banner news not found",
        };
      }
      return {
        success: true,
        data: bannerNews,
        message: "Banner news retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve banner news: ${error}`,
      };
    }
  }

  async createBannerNews(
    data: CreateBannerNewsRequest
  ): Promise<ApiResponse<BannerNews>> {
    try {
      const bannerNews = await this.bannerNewsRepository.create(data);
      return {
        success: true,
        data: bannerNews,
        message: "Banner news created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create banner news: ${error}`,
      };
    }
  }

  async updateBannerNews(
    id: Id,
    data: UpdateBannerNewsRequest
  ): Promise<ApiResponse<BannerNews>> {
    try {
      const existingBannerNews = await this.bannerNewsRepository.findById(id);
      if (!existingBannerNews) {
        return {
          success: false,
          error: "Banner news not found",
        };
      }

      const updatedBannerNews = await this.bannerNewsRepository.update(
        id,
        data
      );
      return {
        success: true,
        data: updatedBannerNews,
        message: "Banner news updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update banner news: ${error}`,
      };
    }
  }

  async deleteBannerNews(id: Id): Promise<ApiResponse<boolean>> {
    try {
      const existingBannerNews = await this.bannerNewsRepository.findById(id);
      if (!existingBannerNews) {
        return {
          success: false,
          error: "Banner news not found",
        };
      }

      await this.bannerNewsRepository.delete(id);
      return {
        success: true,
        data: true,
        message: "Banner news deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete banner news: ${error}`,
      };
    }
  }

  async getBannerNewsByFilters(
    filters: BannerNewsFilters
  ): Promise<ApiResponse<BannerNews[]>> {
    try {
      const bannerNews = await this.bannerNewsRepository.findByFilters(filters);
      return {
        success: true,
        data: bannerNews,
        message: `Found ${bannerNews.length} banner news matching filters`,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve banner news with filters: ${error}`,
      };
    }
  }

  async getActiveBannerNews(): Promise<ApiResponse<BannerNews[]>> {
    try {
      const activeBannerNews = await this.bannerNewsRepository.findActive();
      return {
        success: true,
        data: activeBannerNews,
        message: "Active banner news retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve active banner news: ${error}`,
      };
    }
  }

  async toggleBannerNewsStatus(id: Id): Promise<ApiResponse<BannerNews>> {
    try {
      const existingBannerNews = await this.bannerNewsRepository.findById(id);
      if (!existingBannerNews) {
        return {
          success: false,
          error: "Banner news not found",
        };
      }

      const updatedBannerNews = await this.bannerNewsRepository.update(id, {
        isActive: !existingBannerNews.isActive,
      });

      return {
        success: true,
        data: updatedBannerNews,
        message: `Banner news ${
          updatedBannerNews.isActive ? "activated" : "deactivated"
        } successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to toggle banner news status: ${error}`,
      };
    }
  }

  async getBannerNewsStats(): Promise<
    ApiResponse<{
      total: number;
      active: number;
      inactive: number;
      activeRate: number;
      recentBannerNews: BannerNews[];
    }>
  > {
    try {
      const allBannerNews = await this.bannerNewsRepository.findAll();

      const total = allBannerNews.length;
      const active = allBannerNews.filter(
        (news: BannerNews) => news.isActive
      ).length;
      const inactive = total - active;
      const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;

      const recentBannerNews = allBannerNews
        .sort(
          (a: BannerNews, b: BannerNews) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

      return {
        success: true,
        data: {
          total,
          active,
          inactive,
          activeRate,
          recentBannerNews,
        },
        message: "Banner news statistics retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve banner news statistics: ${error}`,
      };
    }
  }
}
