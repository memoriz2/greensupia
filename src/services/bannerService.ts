import { BannerRepository } from "@/repositories/bannerRepository";
import {
  bannerCreateRequest,
  bannerUpdateRequest,
  bannerResponse,
  bannerListResponse,
} from "@/types/banner";

export class BannerService {
  private bannerRepository: BannerRepository;

  constructor(bannerRepository: BannerRepository) {
    this.bannerRepository = bannerRepository;
  }

  async getAllBanners(
    page: number = 0,
    size: number = 10
  ): Promise<bannerListResponse> {
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

  async getActiveBanners(): Promise<bannerResponse[]> {
    const banners = await this.bannerRepository.findActive();
    return banners.map((banner) => this.bannerRepository.toResponse(banner));
  }

  async getBannerById(id: number): Promise<bannerResponse> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new Error("Banner not found");
    }
    return this.bannerRepository.toResponse(banner);
  }

  async createBanner(data: bannerCreateRequest): Promise<bannerResponse> {
    // 배너는 여러 개 활성화 가능하도록 자동 비활성화 로직 제거
    const banner = await this.bannerRepository.create(data);
    return this.bannerRepository.toResponse(banner);
  }

  async updateBanner(
    id: number,
    data: bannerUpdateRequest
  ): Promise<bannerResponse> {
    // 배너는 여러 개 활성화 가능하도록 자동 비활성화 로직 제거
    const banner = await this.bannerRepository.update(id, data);
    return this.bannerRepository.toResponse(banner);
  }

  async deleteBanner(id: number): Promise<void> {
    await this.bannerRepository.delete(id);
  }

  async toggleBannerActive(id: number): Promise<bannerResponse> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new Error("Banner not found");
    }

    // 배너는 여러 개 활성화 가능하도록 자동 비활성화 로직 제거
    const updatedBanner = await this.bannerRepository.toggleActive(id);
    return this.bannerRepository.toResponse(updatedBanner);
  }
}
