import { NextRequest, NextResponse } from "next/server";
import { BannerRepository } from "@/repositories/bannerRepository";
import { BannerService } from "@/services/bannerService";

const bannerRepository = new BannerRepository();
const bannerService = new BannerService(bannerRepository);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
    }

    const banner = await bannerService.toggleBannerActive(id);
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error toggling banner:", error);
    return NextResponse.json(
      { error: "Failed to toggle banner" },
      { status: 500 }
    );
  }
}
