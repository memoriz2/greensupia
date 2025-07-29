import { prisma } from "@/lib/prisma";
import { Notice, NoticeAttachment } from "@/types/notice";

export class NoticeRepository {
  // 공지사항 목록 조회 (상단고정 먼저, 그 다음 최신순)
  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ notices: Notice[]; total: number }> {
    const offset = (page - 1) * limit;

    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where: { isActive: true },
        include: {
          attachments: true,
        },
        orderBy: [
          { isPinned: "desc" }, // 상단고정 먼저
          { createdAt: "desc" }, // 최신순
        ],
        skip: offset,
        take: limit,
      }),
      prisma.notice.count({
        where: { isActive: true },
      }),
    ]);

    // Prisma 결과를 Notice 타입에 맞게 변환
    const convertedNotices = notices.map((notice) => ({
      ...notice,
      createdAt: notice.createdAt.toISOString(),
      updatedAt: notice.updatedAt.toISOString(),
      attachments: notice.attachments.map((attachment) => ({
        ...attachment,
        createdAt: attachment.createdAt.toISOString(),
      })),
    }));

    return {
      notices: convertedNotices as Notice[],
      total,
    };
  }

  // 공지사항 상세 조회 (조회수 증가)
  async findById(id: number): Promise<Notice | null> {
    const notice = await prisma.notice.findFirst({
      where: { id, isActive: true },
      include: {
        attachments: true,
      },
    });

    if (notice) {
      // 조회수 증가
      await prisma.notice.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      // Prisma 결과를 Notice 타입에 맞게 변환
      const convertedNotice = {
        ...notice,
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
        attachments: notice.attachments.map((attachment) => ({
          ...attachment,
          createdAt: attachment.createdAt.toISOString(),
        })),
      };

      return convertedNotice as Notice;
    }

    return null;
  }

  // 공지사항 생성
  async create(data: {
    title: string;
    content: string;
    author?: string;
    isPinned?: boolean;
  }): Promise<Notice> {
    const notice = await prisma.notice.create({
      data: {
        title: data.title,
        content: data.content,
        author: data.author || "관리자",
        isPinned: data.isPinned || false,
      },
      include: {
        attachments: true,
      },
    });

    // Prisma 결과를 Notice 타입에 맞게 변환
    const convertedNotice = {
      ...notice,
      createdAt: notice.createdAt.toISOString(),
      updatedAt: notice.updatedAt.toISOString(),
      attachments: notice.attachments.map((attachment) => ({
        ...attachment,
        createdAt: attachment.createdAt.toISOString(),
      })),
    };

    return convertedNotice as Notice;
  }

  // 공지사항 수정
  async update(
    id: number,
    data: {
      title?: string;
      content?: string;
      isPinned?: boolean;
      isActive?: boolean;
    }
  ): Promise<Notice | null> {
    const notice = await prisma.notice.update({
      where: { id },
      data,
      include: {
        attachments: true,
      },
    });

    // Prisma 결과를 Notice 타입에 맞게 변환
    const convertedNotice = {
      ...notice,
      createdAt: notice.createdAt.toISOString(),
      updatedAt: notice.updatedAt.toISOString(),
      attachments: notice.attachments.map((attachment) => ({
        ...attachment,
        createdAt: attachment.createdAt.toISOString(),
      })),
    };

    return convertedNotice as Notice;
  }

  // 공지사항 삭제 (소프트 삭제)
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.notice.update({
        where: { id },
        data: { isActive: false },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // 상단고정 토글
  async togglePin(id: number): Promise<Notice | null> {
    const notice = await prisma.notice.findUnique({
      where: { id },
    });

    if (!notice) return null;

    const updatedNotice = await prisma.notice.update({
      where: { id },
      data: { isPinned: !notice.isPinned },
      include: {
        attachments: true,
      },
    });

    // Prisma 결과를 Notice 타입에 맞게 변환
    const convertedNotice = {
      ...updatedNotice,
      createdAt: updatedNotice.createdAt.toISOString(),
      updatedAt: updatedNotice.updatedAt.toISOString(),
      attachments: updatedNotice.attachments.map((attachment) => ({
        ...attachment,
        createdAt: attachment.createdAt.toISOString(),
      })),
    };

    return convertedNotice as Notice;
  }

  // 첨부파일 추가
  async addAttachment(
    noticeId: number,
    data: {
      fileName: string;
      filePath: string;
      fileSize: number;
      mimeType: string;
    }
  ): Promise<NoticeAttachment> {
    const attachment = await prisma.noticeAttachment.create({
      data: {
        noticeId,
        fileName: data.fileName,
        filePath: data.filePath,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      },
    });

    // Prisma 결과를 NoticeAttachment 타입에 맞게 변환
    const convertedAttachment = {
      ...attachment,
      createdAt: attachment.createdAt.toISOString(),
    };

    return convertedAttachment as NoticeAttachment;
  }

  // 첨부파일 다운로드 횟수 증가
  async incrementDownloadCount(attachmentId: number): Promise<void> {
    await prisma.noticeAttachment.update({
      where: { id: attachmentId },
      data: { downloadCount: { increment: 1 } },
    });
  }

  // 첨부파일 삭제
  async deleteAttachment(id: number): Promise<void> {
    try {
      await prisma.noticeAttachment.delete({
        where: { id },
      });
    } catch (err) {
      console.error("첨부파일 삭제 오류:", err);
      throw new Error("첨부파일 삭제에 실패했습니다.");
    }
  }

  // 첨부파일 조회
  async findAttachmentById(
    attachmentId: number
  ): Promise<NoticeAttachment | null> {
    const attachment = await prisma.noticeAttachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) return null;

    // Prisma 결과를 NoticeAttachment 타입에 맞게 변환
    const convertedAttachment = {
      ...attachment,
      createdAt: attachment.createdAt.toISOString(),
    };

    return convertedAttachment as NoticeAttachment;
  }

  async deleteNotice(id: number): Promise<void> {
    try {
      await prisma.notice.delete({
        where: { id },
      });
    } catch (err) {
      console.error("공지사항 삭제 오류:", err);
      throw new Error("공지사항 삭제에 실패했습니다.");
    }
  }
}
