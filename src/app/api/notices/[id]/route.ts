import { NextRequest, NextResponse } from "next/server";
import { NoticeService } from "@/services/noticeService";

const noticeService = new NoticeService();

// GET: 공지사항 상세 조회
export async function GET(
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

    const notice = await noticeService.getNoticeById(parseInt(id));

    if (!notice) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: noticeService.toResponse(notice),
    });
  } catch (error) {
    console.error("공지사항 상세 조회 오류:", error);
    return NextResponse.json(
      { error: "공지사항을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PUT: 공지사항 수정 (관리자만)
export async function PUT(
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

    // FormData 처리
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const isPinned = formData.get("isPinned") === "true";
    const isActive = formData.get("isActive") === "true";
    const attachments = formData.getAll("attachments") as File[];
    const attachmentsToDeleteStr = formData.get(
      "attachmentsToDelete"
    ) as string;

    // 삭제할 첨부파일 ID들 파싱
    let attachmentsToDelete: number[] = [];
    if (attachmentsToDeleteStr) {
      try {
        attachmentsToDelete = JSON.parse(attachmentsToDeleteStr);
      } catch (error) {
        console.error("삭제할 첨부파일 ID 파싱 오류:", error);
      }
    }

    // TODO: 관리자 권한 확인 로직 추가
    // const isAdmin = await checkAdminPermission(request);
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: "관리자만 글을 수정할 수 있습니다." },
    //     { status: 403 }
    //   );
    // }

    const notice = await noticeService.updateNotice(parseInt(id), {
      title,
      content,
      isPinned,
      isActive,
    });

    if (!notice) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 새로 첨부된 파일들 처리
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        if (file instanceof File && file.size > 0) {
          await noticeService.addAttachment(parseInt(id), file);
        }
      }
    }

    // 삭제할 첨부파일들 처리
    if (attachmentsToDelete.length > 0) {
      for (const attachmentId of attachmentsToDelete) {
        await noticeService.deleteAttachment(attachmentId);
      }
    }

    return NextResponse.json({
      success: true,
      data: noticeService.toResponse(notice),
    });
  } catch (error) {
    console.error("공지사항 수정 오류:", error);
    return NextResponse.json(
      { error: "공지사항을 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE: 공지사항 삭제 (관리자만)
export async function DELETE(
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
    //     { error: "관리자만 글을 삭제할 수 있습니다." },
    //     { status: 403 }
    //   );
    // }

    const success = await noticeService.deleteNotice(parseInt(id));

    if (!success) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "공지사항이 삭제되었습니다.",
    });
  } catch (error) {
    console.error("공지사항 삭제 오류:", error);
    return NextResponse.json(
      { error: "공지사항을 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
