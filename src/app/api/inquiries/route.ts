import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InquiryService } from "@/services/inquiryService";
import {
  validatePaginationParams,
  getPaginationOffset,
  createPaginationResult,
} from "@/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. 쿼리 파라미터 파싱
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isAnswered = searchParams.get("isAnswered");
    const isSecret = searchParams.get("isSecret");

    // 2. 유효성 검사
    if (!validatePaginationParams(page, limit)) {
      return NextResponse.json(
        { error: "잘못된 페이지네이션 파라미터입니다." },
        { status: 400 }
      );
    }

    // 3. 필터 조건 구성
    const where: {
      isAnswered?: boolean;
      isSecret?: boolean;
    } = {};
    if (isAnswered !== null) {
      where.isAnswered = isAnswered === "true";
    }
    if (isSecret !== null) {
      where.isSecret = isSecret === "true";
    }

    // 4. 데이터 조회
    const offset = getPaginationOffset(page, limit);

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        select: {
          id: true,
          title: true,
          author: true,
          isSecret: true,
          isAnswered: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.inquiry.count({ where }),
    ]);

    // 5. 응답
    const result = createPaginationResult(inquiries, page, limit, total);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("문의글 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "문의글 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, author, email, isSecret, password } = body;

    // 1. 입력 검증
    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "제목, 내용, 작성자는 필수입니다." },
        { status: 400 }
      );
    }

    // 2. 비밀글 검증
    if (isSecret && !password) {
      return NextResponse.json(
        { error: "비밀글은 비밀번호가 필요합니다." },
        { status: 400 }
      );
    }

    // 3. Service 호출
    const service = new InquiryService();
    let inquiry;

    if (isSecret) {
      inquiry = await service.createSecretInquiry({
        title,
        content,
        author,
        email,
        password,
      });
    } else {
      inquiry = await service.createPublicInquiry({
        title,
        content,
        author,
        email,
      });
    }

    // 4. 응답
    return NextResponse.json({
      success: true,
      data: service.toResponse(inquiry),
      message: "문의글이 성공적으로 등록되었습니다.",
    });
  } catch (error) {
    console.error("문의글 생성 오류:", error);
    return NextResponse.json(
      { error: "문의글 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
