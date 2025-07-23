import { NextRequest, NextResponse } from "next/server";
import { HistoryService } from "@/services/historyService";
import { CreateHistoryRequest } from "@/types/history";

const historyService = new HistoryService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // 특별한 액션 처리
    if (action === "stats") {
      const result = await historyService.getHistoryStats();
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json(result.data, { status: 200 });
    }

    // 연도 범위 조회
    const startYear = searchParams.get("startYear");
    const endYear = searchParams.get("endYear");
    if (startYear && endYear) {
      const result = await historyService.getHistoriesByYearRange(
        parseInt(startYear),
        parseInt(endYear)
      );
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json(result.data, { status: 200 });
    }

    // 필터링 처리
    const year = searchParams.get("year");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    if (year || search || sortBy || sortOrder) {
      const filters = {
        ...(year && { year: parseInt(year) }),
        ...(search && { search }),
        ...(sortBy && {
          sortBy: sortBy as "year" | "createdAt" | "updatedAt" | "title",
        }),
        ...(sortOrder && { sortOrder: sortOrder as "asc" | "desc" }),
      };

      const result = await historyService.getHistoriesByFilters(filters);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json(result.data, { status: 200 });
    }

    // 기본 전체 조회
    const result = await historyService.getAllHistories();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("History API 에러: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateHistoryRequest = await request.json();

    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (body.year === undefined || body.year < 1900 || body.year > 2100) {
      return NextResponse.json(
        { error: "Valid year is required (1900-2100)" },
        { status: 400 }
      );
    }

    const result = await historyService.createHistory(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
