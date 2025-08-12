import { NextRequest, NextResponse } from "next/server";
import { BannerNewsService } from "@/services/bannerNewsService";
import { updateBannerNewsRequest } from "@/types/bannerNews";

const bannerNewsService = new BannerNewsService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const bannerNewsId = parseInt(id);

    if (isNaN(bannerNewsId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = await bannerNewsService.getBannerNewsById(bannerNewsId);

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const bannerNewsId = parseInt(id);

    if (isNaN(bannerNewsId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body: updateBannerNewsRequest = await request.json();

    const result = await bannerNewsService.updateBannerNews(bannerNewsId, body);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const bannerNewsId = parseInt(id);

    if (isNaN(bannerNewsId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = await bannerNewsService.deleteBannerNews(bannerNewsId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Banner news deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
