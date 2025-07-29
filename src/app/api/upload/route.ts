import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// 가비아 서버용 설정
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    console.log("업로드 요청 시작");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "banner-news"; // 폴더 파라미터 추가

    if (!file) {
      console.log("파일이 선택되지 않음");
      return NextResponse.json(
        { error: "파일이 선택되지 않았습니다." },
        { status: 400 }
      );
    }

    console.log("파일 정보:", {
      name: file.name,
      size: file.size,
      type: file.type,
      folder: folder,
    });

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      console.log("잘못된 파일 타입:", file.type);
      return NextResponse.json(
        { error: "이미지 파일만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (50MB 제한)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      console.log("파일 크기 초과:", file.size);
      return NextResponse.json(
        { error: "파일 크기는 50MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    // 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;

    console.log("생성된 파일명:", fileName);

    // 업로드 디렉토리 생성 (동적 폴더)
    const uploadDir = join(process.cwd(), "public", folder);
    console.log("업로드 디렉토리:", uploadDir);

    // 디렉토리 존재 확인 및 생성
    if (!existsSync(uploadDir)) {
      console.log("디렉토리 생성 중...");
      try {
        await mkdir(uploadDir, { recursive: true });
        console.log("디렉토리 생성 완료");
      } catch (dirError) {
        console.error("디렉토리 생성 실패:", dirError);
        throw new Error(`디렉토리 생성 실패: ${dirError}`);
      }
    }

    // 파일 저장
    console.log("파일 저장 시작");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, fileName);

    console.log("저장 경로:", filePath);
    await writeFile(filePath, buffer);
    console.log("파일 저장 완료");

    // 파일 존재 확인
    if (existsSync(filePath)) {
      console.log("파일 저장 확인됨");
    } else {
      console.log("파일 저장 실패 - 파일이 존재하지 않음");
      throw new Error("파일 저장 후 존재하지 않음");
    }

    // URL 반환 (동적 경로)
    const imageUrl = `/static-assets/${folder}/${fileName}`;
    console.log("반환할 URL:", imageUrl);

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName,
      folder,
    });
  } catch (error) {
    console.error("파일 업로드 오류:", error);

    // 더 자세한 오류 정보 반환
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      {
        error: "파일 업로드 중 오류가 발생했습니다.",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
