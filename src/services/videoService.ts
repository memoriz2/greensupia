import { VideoRepository } from "@/repositories/videoRepository";
import {
  videoCreateRequest,
  videoUpdateRequest,
  videoResponse,
  videoListResponse,
} from "@/types/video";
import { extractThumbnailFromUrl, normalizeVideoUrl } from "@/utils/videoUtils";

export class VideoService {
  private videoRepository: VideoRepository;

  constructor(videoRepository: VideoRepository) {
    this.videoRepository = videoRepository;
  }

  async getAllVideos(
    page: number = 0,
    size: number = 10
  ): Promise<videoListResponse> {
    const result = await this.videoRepository.findWithPagination(page, size);
    return {
      content: result.data.map((video) =>
        this.videoRepository.toResponse(video)
      ),
      totalElements: result.pagination.total,
      totalPages: result.pagination.totalPages,
      size: result.pagination.limit,
      number: result.pagination.page,
    };
  }

  async getActiveVideos(): Promise<videoResponse[]> {
    const videos = await this.videoRepository.findActive();
    return videos.map((video) => this.videoRepository.toResponse(video));
  }

  async getVideoById(id: number): Promise<videoResponse> {
    const video = await this.videoRepository.findById(id);
    if (!video) {
      throw new Error("Video not found");
    }
    return this.videoRepository.toResponse(video);
  }

  async createVideo(data: videoCreateRequest): Promise<videoResponse> {
    // URL 정규화 (iframe 코드는 그대로 유지)
    if (data.videoUrl) {
      data.videoUrl = normalizeVideoUrl(data.videoUrl);
    }

    // 썸네일이 없으면 자동으로 추출
    if (!data.thumbnailUrl && data.videoUrl) {
      const thumbnail = extractThumbnailFromUrl(data.videoUrl);
      if (thumbnail) {
        data.thumbnailUrl = thumbnail;
      }
    }

    // 새 비디오를 활성화하려는 경우, 기존 활성 비디오들을 모두 비활성화
    if (data.isActive) {
      await this.videoRepository.deactivateAll();
    }

    const video = await this.videoRepository.create(data);
    return this.videoRepository.toResponse(video);
  }

  async updateVideo(
    id: number,
    data: videoUpdateRequest
  ): Promise<videoResponse> {
    // URL 정규화 (iframe 코드는 그대로 유지)
    if (data.videoUrl) {
      data.videoUrl = normalizeVideoUrl(data.videoUrl);
    }

    // 비디오 URL이 변경되고 썸네일이 없으면 자동으로 추출
    if (data.videoUrl && !data.thumbnailUrl) {
      const thumbnail = extractThumbnailFromUrl(data.videoUrl);
      if (thumbnail) {
        data.thumbnailUrl = thumbnail;
      }
    }

    // 현재 비디오를 활성화하려는 경우, 기존 활성 비디오들을 모두 비활성화
    if (data.isActive) {
      await this.videoRepository.deactivateAllExcept(id);
    }

    const video = await this.videoRepository.update(id, data);
    return this.videoRepository.toResponse(video);
  }

  async deleteVideo(id: number): Promise<void> {
    await this.videoRepository.delete(id);
  }

  async toggleVideoActive(id: number): Promise<videoResponse> {
    // 현재 비디오 정보 가져오기
    const currentVideo = await this.videoRepository.findById(id);
    if (!currentVideo) {
      throw new Error("Video not found");
    }

    // 비활성 상태에서 활성화하려는 경우, 기존 활성 비디오들을 모두 비활성화
    if (!currentVideo.isActive) {
      await this.videoRepository.deactivateAll();
    }

    const video = await this.videoRepository.toggleActive(id);
    return this.videoRepository.toResponse(video);
  }
}
