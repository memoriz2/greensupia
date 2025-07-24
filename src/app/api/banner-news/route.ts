import { NextRequest, NextResponse } from "next/server";
import { BannerNewsService } from "@/services/bannerNewsService";
import { CreateBannerNewsRequest } from "@/types/bannerNews";

const bannerNewsService = new BannerNewsService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // 특별한 액션 처리
    if (action === "active") {
      const result = await bannerNewsService.getActiveBannerNews();
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json(result.data, { status: 200 });
    }

    if (action === "stats") {
      const result = await bannerNewsService.getBannerNewsStats();
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json(result.data, { status: 200 });
    }

    // 필터링 처리
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    if (isActive || search || sortBy || sortOrder) {
      const filters = {
        ...(isActive && { isActive: isActive === "true" }),
        ...(search && { search }),
        ...(sortBy && {
          sortBy: sortBy as "createdAt" | "updatedAt" | "title",
        }),
        ...(sortOrder && { sortOrder: sortOrder as "asc" | "desc" }),
      };

      const result = await bannerNewsService.getBannerNewsByFilters(filters);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json(result.data, { status: 200 });
    }

    // 기본 전체 조회
    const result = await bannerNewsService.getAllBannerNews();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (error) {
    console.error("Banner News API 에러: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBannerNewsRequest = await request.json();

    console.log("POST 요청 받은 데이터:", body);

    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const result = await bannerNewsService.createBannerNews(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("BannerNews POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
