import { NextRequest, NextResponse } from "next/server";
import { VideoRepository } from "@/repositories/videoRepository";
import { VideoService } from "@/services/videoService";

const videoRepository = new VideoRepository();
const videoService = new VideoService(videoRepository);

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

    const video = await videoService.toggleVideoActive(id);
    return NextResponse.json(video);
  } catch (error) {
    console.error("Error toggling video:", error);
    return NextResponse.json(
      { error: "Failed to toggle video" },
      { status: 500 }
    );
  }
}
