import { NextRequest, NextResponse } from "next/server";
import { NoticeService } from "@/services/noticeService";

const noticeService = new NoticeService();

// GET: 공지사항 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await noticeService.getNotices(page, limit);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("공지사항 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "공지사항 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST: 공지사항 생성 (관리자만)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const isPinned = formData.get("isPinned") === "true";
    const files = formData.getAll("files") as File[];

    if (!title || !content) {
      return NextResponse.json(
        { error: "제목과 내용은 필수입니다." },
        { status: 400 }
      );
    }

    // TODO: 관리자 권한 확인 로직 추가
    // const isAdmin = await checkAdminPermission(request);
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: "관리자만 글을 작성할 수 있습니다." },
    //     { status: 403 }
    //   );
    // }

    const notice = await noticeService.createNotice({
      title,
      content,
      author,
      isPinned,
      attachments: files.length > 0 ? files : undefined,
    });

    return NextResponse.json({
      success: true,
      data: noticeService.toResponse(notice),
    });
  } catch (error) {
    console.error("공지사항 생성 오류:", error);
    return NextResponse.json(
      { error: "공지사항을 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
