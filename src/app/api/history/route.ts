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
        startYear,
        endYear
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
        ...(year && { year }),
        ...(search && { search }),
        ...(sortBy && {
          sortBy: sortBy as "year" | "createdAt" | "updatedAt" | "sortOrder",
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

    return NextResponse.json({ data: result.data }, { status: 200 });
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
    console.log("POST 요청 받은 데이터:", body);

    if (!body.year || body.year.trim().length === 0) {
      console.log("연도 누락 에러");
      return NextResponse.json({ error: "Year is required" }, { status: 400 });
    }

    if (!body.description || body.description.trim().length === 0) {
      console.log("설명 누락 에러");
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // 연도 유효성 검사 (문자열로 처리)
    const yearPattern = /^(19|20)\d{2}$/;
    if (!yearPattern.test(body.year)) {
      console.log("연도 형식 에러:", body.year);
      return NextResponse.json(
        { error: "Valid year is required (1900-2099)" },
        { status: 400 }
      );
    }

    console.log("유효성 검사 통과, 서비스 호출");
    const result = await historyService.createHistory(body);
    if (!result.success) {
      console.log("서비스 에러:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    console.log("생성 성공:", result.data);
    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("POST 요청 처리 중 에러:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
