import { NextRequest, NextResponse } from "next/server";
import { VideoRepository } from "@/repositories/videoRepository";
import { VideoService } from "@/services/videoService";
import { extractThumbnailFromUrl, normalizeVideoUrl } from "@/utils/videoUtils";

const videoRepository = new VideoRepository();
const videoService = new VideoService(videoRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");

    if (action === "active") {
      const activeVideos = await videoService.getActiveVideos();
      return NextResponse.json(activeVideos);
    }

    const videos = await videoService.getAllVideos(page, size);
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
      : 0;
    const isActive = formData.get("isActive") === "true";

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: "Title and video URL are required" },
        { status: 400 }
      );
    }

    // URL 정규화 (iframe 코드는 그대로 유지)
    const normalizedVideoUrl = normalizeVideoUrl(videoUrl);

    // 썸네일이 없으면 자동으로 추출
    let finalThumbnailUrl = thumbnailUrl;
    if (!thumbnailUrl && normalizedVideoUrl) {
      const extractedThumbnail = extractThumbnailFromUrl(normalizedVideoUrl);
      if (extractedThumbnail) {
        finalThumbnailUrl = extractedThumbnail;
      }
    }

    const video = await videoService.createVideo({
      title,
      description,
      videoUrl: normalizedVideoUrl,
      thumbnailUrl: finalThumbnailUrl,
      duration,
      sortOrder,
      isActive,
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
