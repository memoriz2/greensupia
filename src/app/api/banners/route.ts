import { NextRequest, NextResponse } from "next/server";
import { BannerRepository } from "@/repositories/bannerRepository";
import { BannerService } from "@/services/bannerService";

const bannerRepository = new BannerRepository();
const bannerService = new BannerService(bannerRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");

    if (action === "active") {
      const activeBanners = await bannerService.getActiveBanners();
      return NextResponse.json(activeBanners);
    }

    if (action === "stats") {
      const allBanners = await bannerRepository.findAll();
      const stats = {
        total: allBanners.length,
        active: allBanners.filter((banner) => banner.isActive).length,
        inactive: allBanners.filter((banner) => !banner.isActive).length,
      };
      return NextResponse.json(stats);
    }

    const banners = await bannerService.getAllBanners(page, size);
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const sortOrder = formData.get("sortOrder")
      ? parseInt(formData.get("sortOrder") as string)
      : 0;
    const isActive = formData.get("isActive") === "true";

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "Title and image URL are required" },
        { status: 400 }
      );
    }

    const banner = await bannerService.createBanner({
      title,
      imageUrl,
      linkUrl,
      sortOrder,
      isActive,
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
