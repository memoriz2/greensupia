import { NextRequest, NextResponse } from "next/server";
import { GreetingRepository } from "@/repositories/greetingRepository";
import { GreetingService } from "@/services/greetingService";

const greetingRepository = new GreetingRepository();
const greetingService = new GreetingService(greetingRepository);

export async function GET(
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

    const greeting = await greetingService.getGreetingById(id);
    return NextResponse.json(greeting);
  } catch (error) {
    console.error("Error fetching greeting:", error);
    return NextResponse.json(
      { error: "Failed to fetch greeting" },
      { status: 500 }
    );
  }
}

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

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const isActive = formData.get("isActive") === "true";

    const updateData: {
      title?: string;
      content?: string;
      isActive?: boolean;
    } = {};
    if (title !== null) updateData.title = title;
    if (content !== null) updateData.content = content;
    if (isActive !== undefined) updateData.isActive = isActive;

    const greeting = await greetingService.updateGreeting(id, updateData);
    return NextResponse.json(greeting);
  } catch (error) {
    console.error("Error updating greeting:", error);
    return NextResponse.json(
      { error: "Failed to update greeting" },
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
      return NextResponse.json(
        { error: "Invalid greeting ID" },
        { status: 400 }
      );
    }

    await greetingService.deleteGreeting(id);
    return NextResponse.json({ message: "Greeting deleted successfully" });
  } catch (error) {
    console.error("Error deleting greeting:", error);
    return NextResponse.json(
      { error: "Failed to delete greeting" },
      { status: 500 }
    );
  }
}
