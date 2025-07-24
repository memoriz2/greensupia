import { NextRequest, NextResponse } from "next/server";
import { GreetingRepository } from "@/repositories/greetingRepository";
import { GreetingService } from "@/services/greetingService";

const greetingRepository = new GreetingRepository();
const greetingService = new GreetingService(greetingRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");

    if (action === "active") {
      const activeGreetings = await greetingService.getActiveGreetings();
      return NextResponse.json(activeGreetings);
    }

    const greetings = await greetingService.getAllGreetings(page, size);
    return NextResponse.json(greetings);
  } catch (error) {
    console.error("Error fetching greetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch greetings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const isActive = formData.get("isActive") === "true";

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const greeting = await greetingService.createGreeting({
      title,
      content,
      isActive,
    });

    return NextResponse.json(greeting, { status: 201 });
  } catch (error) {
    console.error("Error creating greeting:", error);
    return NextResponse.json(
      { error: "Failed to create greeting" },
      { status: 500 }
    );
  }
}
