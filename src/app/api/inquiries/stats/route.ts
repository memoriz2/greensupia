import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InquiryService } from "@/services/inquiryService";

export async function GET() {
  try {
    const service = new InquiryService(prisma);
    const stats = await service.getInquiryStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("문의글 통계 조회 오류:", error);
    return NextResponse.json(
      { error: "문의글 통계를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
