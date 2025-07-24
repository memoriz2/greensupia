import { BannerRepository } from "@/repositories/bannerRepository";
import {
  BannerCreateRequest,
  BannerUpdateRequest,
  BannerResponse,
  BannerListResponse,
} from "@/types/banner";

export class BannerService {
  private bannerRepository: BannerRepository;

  constructor(bannerRepository: BannerRepository) {
    this.bannerRepository = bannerRepository;
  }

  async getAllBanners(
    page: number = 0,
    size: number = 10
  ): Promise<BannerListResponse> {
    const result = await this.bannerRepository.findWithPagination(page, size);
    return {
      content: result.data.map((banner) =>
        this.bannerRepository.toResponse(banner)
      ),
      totalElements: result.pagination.total,
      totalPages: result.pagination.totalPages,
      size: result.pagination.limit,
      number: result.pagination.page,
    };
  }

  async getActiveBanners(): Promise<BannerResponse[]> {
    const banners = await this.bannerRepository.findActive();
    return banners.map((banner) => this.bannerRepository.toResponse(banner));
  }

  async getBannerById(id: number): Promise<BannerResponse> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new Error("Banner not found");
    }
    return this.bannerRepository.toResponse(banner);
  }

  async createBanner(data: BannerCreateRequest): Promise<BannerResponse> {
    // 활성화하려는 경우 기존 활성 배너들을 모두 비활성화
    if (data.isActive) {
      await this.bannerRepository.deactivateAll();
    }
    const banner = await this.bannerRepository.create(data);
    return this.bannerRepository.toResponse(banner);
  }

  async updateBanner(
    id: number,
    data: BannerUpdateRequest
  ): Promise<BannerResponse> {
    // 활성화하려는 경우 기존 활성 배너들을 모두 비활성화
    if (data.isActive) {
      await this.bannerRepository.deactivateAllExcept(id);
    }
    const banner = await this.bannerRepository.update(id, data);
    return this.bannerRepository.toResponse(banner);
  }

  async deleteBanner(id: number): Promise<void> {
    await this.bannerRepository.delete(id);
  }

  async toggleBannerActive(id: number): Promise<BannerResponse> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new Error("Banner not found");
    }

    // 활성화하려는 경우 기존 활성 배너들을 모두 비활성화
    if (!banner.isActive) {
      await this.bannerRepository.deactivateAll();
    }

    const updatedBanner = await this.bannerRepository.toggleActive(id);
    return this.bannerRepository.toResponse(updatedBanner);
  }
}
