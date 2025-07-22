import { NextRequest, NextResponse } from "next/server";
import { TodoService } from "@/services/todoService";
import { CreateTodoRequest } from "@/types/todo";

const todoService = new TodoService();

export async function GET() {
  try {
    console.log("API 시작: todos GET 요청 들어옴");
    const result = await todoService.getAllTodos();
    console.log("todoService 결과: ", result);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("API 에러: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTodoRequest = await request.json();

    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const result = await todoService.createTodo(body);
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
