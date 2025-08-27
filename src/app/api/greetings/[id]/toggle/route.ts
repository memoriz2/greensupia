import { NextRequest, NextResponse } from "next/server";
import { GreetingRepository } from "@/repositories/greetingRepository";
import { GreetingService } from "@/services/greetingService";

const greetingRepository = new GreetingRepository();
const greetingService = new GreetingService(greetingRepository);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid greeting ID" },
        { status: 400 }
      );
    }

    const greeting = await greetingService.toggleGreetingActive(id);
    return NextResponse.json(greeting);
  } catch (error) {
    console.error("Error toggling greeting:", error);
    return NextResponse.json(
      { error: "Failed to toggle greeting" },
      { status: 500 }
    );
  }
}
