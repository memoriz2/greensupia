import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InquiryService } from "@/services/inquiryService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    // 1. ID 유효성 검사
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: "올바른 문의글 ID가 아닙니다." },
        { status: 400 }
      );
    }

    // 2. Repository 직접 호출
    const { InquiryRepository } = await import(
      "@/repositories/inquiryRepository"
    );
    const repository = new InquiryRepository(prisma);
    const inquiry = await repository.findById(id);

    // 3. 문의글 존재 여부 확인
    if (!inquiry) {
      return NextResponse.json(
        { error: "문의글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 4. 비밀글인 경우 비밀번호 검증 여부 확인
    const url = new URL(request.url);
    const isVerified = url.searchParams.get("verified") === "true";

    if (inquiry.isSecret && !isVerified) {
      // 비밀글이고 비밀번호가 확인되지 않은 경우
      return NextResponse.json({
        success: true,
        data: {
          id: inquiry.id,
          title: inquiry.title,
          content: "비밀글입니다. 비밀번호를 입력해주세요.",
          author: inquiry.author,
          isSecret: inquiry.isSecret,
          isAnswered: inquiry.isAnswered,
          createdAt: inquiry.createdAt,
          updatedAt: inquiry.updatedAt,
          requiresPassword: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: inquiry.id,
        title: inquiry.title,
        content: inquiry.content,
        author: inquiry.author,
        isSecret: inquiry.isSecret,
        isAnswered: inquiry.isAnswered,
        answer: inquiry.answer,
        answeredAt: inquiry.answeredAt,
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.updatedAt,
      },
    });
  } catch (error) {
    console.error("문의글 상세 조회 오류:", error);
    return NextResponse.json(
      { error: "문의글 상세 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const { title, content, author, email, isSecret, password } = body;

    // 1. ID 유효성 검사
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: "올바른 문의글 ID가 아닙니다." },
        { status: 400 }
      );
    }

    // 2. 입력 검증
    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "제목, 내용, 작성자는 필수입니다." },
        { status: 400 }
      );
    }

    // 3. Service 호출
    const service = new InquiryService();
    const updatedInquiry = await service.updateInquiry(id, {
      title,
      content,
      author,
      email,
      isSecret,
      password,
    });

    return NextResponse.json({
      success: true,
      data: service.toResponse(updatedInquiry),
      message: "문의글이 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    console.error("문의글 수정 오류:", error);
    return NextResponse.json(
      { error: "문의글 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
