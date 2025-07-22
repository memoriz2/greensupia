import { NextRequest, NextResponse } from "next/server";
import { TodoService } from "@/services/todoService";
import { UpdateTodoRequest } from "@/types/todo";

const todoService = new TodoService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = await todoService.getTodoById(todoId);

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
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body: UpdateTodoRequest = await request.json();

    const result = await todoService.updateTodo(todoId, body);

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
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = await todoService.deleteTodo(todoId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
