import { NextRequest, NextResponse } from "next/server";
import { HistoryService } from "@/services/historyService";
import { updateHistoryRequest } from "@/types/history";

const historyService = new HistoryService();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body: updateHistoryRequest = await request.json();

    // 연도 유효성 검사
    if (body.year) {
      const yearPattern = /^(19|20)\d{2}$/;
      if (!yearPattern.test(body.year)) {
        return NextResponse.json(
          { error: "Valid year is required (1900-2099)" },
          { status: 400 }
        );
      }
    }

    const result = await historyService.updateHistory(id, body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("History update error:", error);
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
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await historyService.deleteHistory(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(
      { message: "History deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("History delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
