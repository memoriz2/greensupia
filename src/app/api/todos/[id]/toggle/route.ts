import { NextRequest, NextResponse } from "next/server";
import { TodoService } from "@/services/todoService";

const todoService = new TodoService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = await todoService.toggleTodoComplete(todoId);

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
