import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InquiryService } from "@/services/inquiryService";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const { answer } = body;

    // 1. ID 유효성 검사
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: "올바른 문의글 ID가 아닙니다." },
        { status: 400 }
      );
    }

    // 2. 답변 입력 검증
    if (!answer || answer.trim().length === 0) {
      return NextResponse.json(
        { error: "답변 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    // 3. Service 호출 (알림 포함)
    const service = new InquiryService(prisma);
    const updatedInquiry = await service.addAnswerWithNotification(
      id,
      answer.trim()
    );

    // 4. 성공 응답
    return NextResponse.json({
      success: true,
      message: "답변이 성공적으로 추가되었습니다.",
      data: service.toResponse(updatedInquiry),
    });
  } catch (error) {
    console.error("답변 추가 오류:", error);
    return NextResponse.json(
      { error: "답변 추가 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
