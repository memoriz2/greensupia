import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // params를 await로 해결
    const resolvedParams = await params;

    // 파일 경로 구성
    const filePath = path.join(
      process.cwd(),
      "public",
      "banner-news",
      ...resolvedParams.path
    );

    // 파일 존재 확인
    await fs.access(filePath);

    // 파일 읽기
    const fileBuffer = await fs.readFile(filePath);

    // 파일 확장자에 따른 Content-Type 설정
    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
      }[ext] || "application/octet-stream";

    // 응답 헤더 설정
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("Content-Length", fileBuffer.length.toString());

    // CORS 헤더 설정 (필요시)
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    // Response 객체 직접 생성하여 Buffer 반환
    return new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    // 파일이 존재하지 않는 경우 - 타입 안전하게 처리
    if (error instanceof Error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === "ENOENT") {
        return new NextResponse("File not found", {
          status: 404,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }
    }

    // 기타 오류
    console.error("정적 파일 서빙 오류:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
