import { NextRequest, NextResponse } from "next/server";
import { BannerNewsService } from "@/services/bannerNewsService";

const bannerNewsService = new BannerNewsService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const bannerNewsId = parseInt(id);

    if (isNaN(bannerNewsId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = await bannerNewsService.toggleBannerNewsStatus(bannerNewsId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
