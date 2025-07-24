import { NextRequest, NextResponse } from "next/server";
import { VideoRepository } from "@/repositories/videoRepository";
import { VideoService } from "@/services/videoService";
import { extractThumbnailFromUrl, normalizeVideoUrl } from "@/utils/videoUtils";

const videoRepository = new VideoRepository();
const videoService = new VideoService(videoRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const video = await videoService.getVideoById(id);
    return NextResponse.json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const thumbnailUrl = formData.get("thumbnailUrl") as string;
    const duration = formData.get("duration")
      ? parseInt(formData.get("duration") as string)
      : undefined;
    const sortOrder = formData.get("sortOrder")
      ? parseInt(formData.get("sortOrder") as string)
      : undefined;
    const isActive = formData.get("isActive") === "true";

    const updateData: {
      title?: string;
      description?: string;
      videoUrl?: string;
      thumbnailUrl?: string;
      duration?: number;
      sortOrder?: number;
      isActive?: boolean;
    } = {};
    if (title !== null) updateData.title = title;
    if (description !== null) updateData.description = description;
    if (duration !== undefined) updateData.duration = duration;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    // 비디오 URL 처리
    if (videoUrl !== null) {
      // URL 정규화 (iframe 코드는 그대로 유지)
      const normalizedVideoUrl = normalizeVideoUrl(videoUrl);
      updateData.videoUrl = normalizedVideoUrl;

      // 썸네일 처리: 비디오 URL이 변경되고 썸네일이 없으면 자동으로 추출
      if (!thumbnailUrl) {
        const extractedThumbnail = extractThumbnailFromUrl(normalizedVideoUrl);
        if (extractedThumbnail) {
          updateData.thumbnailUrl = extractedThumbnail;
        }
      }
    } else if (thumbnailUrl !== null) {
      updateData.thumbnailUrl = thumbnailUrl;
    }

    const video = await videoService.updateVideo(id, updateData);
    return NextResponse.json(video);
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    await videoService.deleteVideo(id);
    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
