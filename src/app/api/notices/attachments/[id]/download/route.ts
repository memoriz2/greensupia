import { NextRequest, NextResponse } from "next/server";
import { NoticeService } from "@/services/noticeService";
import { readFile } from "fs/promises";
import { join } from "path";

const noticeService = new NoticeService();

// GET: 첨부파일 다운로드
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attachmentId = parseInt(id);

    if (isNaN(attachmentId)) {
      return NextResponse.json(
        { error: "잘못된 첨부파일 ID입니다." },
        { status: 400 }
      );
    }

    const attachmentInfo = await noticeService.downloadAttachment(attachmentId);

    if (!attachmentInfo) {
      return NextResponse.json(
        { error: "첨부파일을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 파일 경로에서 실제 파일 시스템 경로로 변환
    const filePath = attachmentInfo.filePath.replace("/static-assets/", "");
    const fullPath = join(process.cwd(), "public", filePath);

    try {
      const fileBuffer = await readFile(fullPath);

      // 파일 다운로드 응답 생성
      const response = new NextResponse(fileBuffer);
      response.headers.set(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(attachmentInfo.fileName)}"`
      );
      response.headers.set("Content-Type", "application/octet-stream");

      return response;
    } catch (fileError) {
      console.error("파일 읽기 오류:", fileError);
      return NextResponse.json(
        { error: "파일을 읽을 수 없습니다." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("첨부파일 다운로드 오류:", error);
    return NextResponse.json(
      { error: "첨부파일을 다운로드하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
