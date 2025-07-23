import { NextRequest, NextResponse } from "next/server";
import { HistoryService } from "@/services/historyService";
import { UpdateHistoryRequest } from "@/types/history";

const historyService = new HistoryService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const historyId = parseInt(id);

    if (isNaN(historyId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = await historyService.getHistoryById(historyId);

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
    const historyId = parseInt(id);

    if (isNaN(historyId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body: UpdateHistoryRequest = await request.json();

    const result = await historyService.updateHistory(historyId, body);

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
    const historyId = parseInt(id);

    if (isNaN(historyId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = await historyService.deleteHistory(historyId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(
      { message: "History deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
