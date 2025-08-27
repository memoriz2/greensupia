import { NextRequest, NextResponse } from "next/server";
import { BannerRepository } from "@/repositories/bannerRepository";
import { BannerService } from "@/services/bannerService";

const bannerRepository = new BannerRepository();
const bannerService = new BannerService(bannerRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
    }

    const banner = await bannerService.getBannerById(id);
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
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
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const sortOrder = formData.get("sortOrder")
      ? parseInt(formData.get("sortOrder") as string)
      : undefined;
    const isActive = formData.get("isActive") === "true";

    const updateData: {
      title?: string;
      imageUrl?: string;
      linkUrl?: string;
      sortOrder?: number;
      isActive?: boolean;
    } = {};
    if (title !== null) updateData.title = title;
    if (imageUrl !== null) updateData.imageUrl = imageUrl;
    if (linkUrl !== null) updateData.linkUrl = linkUrl;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const banner = await bannerService.updateBanner(id, updateData);
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
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
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
    }

    await bannerService.deleteBanner(id);
    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
