import { NextRequest, NextResponse } from "next/server";
import { NoticeService } from "@/services/noticeService";

const noticeService = new NoticeService();

// PATCH: 상단고정 토글 (관리자만)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "잘못된 공지사항 ID입니다." },
        { status: 400 }
      );
    }

    // TODO: 관리자 권한 확인 로직 추가
    // const isAdmin = await checkAdminPermission(request);
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: "관리자만 상단고정을 변경할 수 있습니다." },
    //     { status: 403 }
    //   );
    // }

    const notice = await noticeService.togglePin(parseInt(id));

    if (!notice) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: noticeService.toResponse(notice),
      message: notice.isPinned
        ? "상단고정되었습니다."
        : "상단고정이 해제되었습니다.",
    });
  } catch (error) {
    console.error("상단고정 토글 오류:", error);
    return NextResponse.json(
      { error: "상단고정을 변경하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
