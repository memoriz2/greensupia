import { NextRequest, NextResponse } from "next/server";
import { InquiryService } from "@/services/inquiryService";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const { password } = body;

    // 1. ID 유효성 검사
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: "올바른 문의글 ID가 아닙니다." },
        { status: 400 }
      );
    }

    // 2. 비밀번호 입력 검증
    if (!password) {
      return NextResponse.json(
        { error: "비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // 3. Service 호출
    const service = new InquiryService();
    const isVerified = await service.verifyInquiryPassword(id, password);

    // 4. 비밀번호 확인 결과
    if (!isVerified) {
      return NextResponse.json(
        { error: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // 5. 성공 응답
    return NextResponse.json({
      success: true,
      message: "비밀번호가 확인되었습니다.",
      data: {
        verified: true,
        inquiryId: id,
      },
    });
  } catch (error) {
    console.error("비밀번호 확인 오류:", error);
    return NextResponse.json(
      { error: "비밀번호 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
