import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function DELETE(request: NextRequest) {
  try {
    const { filePath } = await request.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "파일 경로가 제공되지 않았습니다." },
        { status: 400 }
      );
    }

    // 보안 검증: public 폴더 내의 파일만 삭제 가능
    const fullPath = join(process.cwd(), "public", filePath.replace(/^\//, ""));

    // 경로 검증 (public 폴더 밖으로 나가지 않도록)
    if (!fullPath.startsWith(join(process.cwd(), "public"))) {
      return NextResponse.json(
        { error: "잘못된 파일 경로입니다." },
        { status: 400 }
      );
    }

    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: "파일을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    await unlink(fullPath);

    return NextResponse.json({
      success: true,
      message: "파일이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("파일 삭제 오류:", error);
    return NextResponse.json(
      { error: "파일 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
