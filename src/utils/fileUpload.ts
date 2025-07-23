import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export interface UploadedFile {
  fileName: string;
  filePath: string;
  fileSize: number;
}

export async function uploadImage(
  file: File,
  folder: string = "uploads"
): Promise<UploadedFile> {
  try {
    // 파일 확장자 검증
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "지원하지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP만 지원)"
      );
    }

    // 파일 크기 검증 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("파일 크기가 너무 큽니다. (최대 10MB)");
    }

    // 업로드 디렉토리 생성
    const uploadDir = join(process.cwd(), "public", folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 파일명 생성 (중복 방지)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const fileName = `${timestamp}_${randomString}.${extension}`;
    const filePath = join(uploadDir, fileName);

    // 파일 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return {
      fileName: file.name,
      filePath: `/${folder}/${fileName}`,
      fileSize: file.size,
    };
  } catch (error) {
    console.error("파일 업로드 에러:", error);
    throw error;
  }
}

export function deleteImage(filePath: string): void {
  try {
    const fullPath = join(process.cwd(), "public", filePath.replace(/^\//, ""));
    if (existsSync(fullPath)) {
      const { unlink } = require("fs/promises");
      unlink(fullPath).catch(console.error);
    }
  } catch (error) {
    console.error("파일 삭제 에러:", error);
  }
}
