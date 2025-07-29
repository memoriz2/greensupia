import { NoticeRepository } from "@/repositories/noticeRepository";
import {
  Notice,
  NoticeAttachment,
  CreateNoticeRequest,
  UpdateNoticeRequest,
  NoticeListResponse,
} from "@/types/notice";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export class NoticeService {
  private repository: NoticeRepository;

  constructor() {
    this.repository = new NoticeRepository();
  }

  // 공지사항 목록 조회
  async getNotices(
    page: number = 1,
    limit: number = 10
  ): Promise<NoticeListResponse> {
    const result = await this.repository.findAll(page, limit);

    return {
      notices: result.notices,
      total: result.total,
      page,
      limit,
    };
  }

  // 공지사항 상세 조회
  async getNoticeById(id: number): Promise<Notice | null> {
    return await this.repository.findById(id);
  }

  // 공지사항 생성
  async createNotice(data: CreateNoticeRequest): Promise<Notice> {
    const notice = await this.repository.create({
      title: data.title,
      content: data.content,
      author: data.author,
      isPinned: data.isPinned,
    });

    // 첨부파일 처리
    if (data.attachments && data.attachments.length > 0) {
      await this.handleAttachments(notice.id, data.attachments);
    }

    return notice;
  }

  // 공지사항 수정
  async updateNotice(
    id: number,
    data: UpdateNoticeRequest
  ): Promise<Notice | null> {
    return await this.repository.update(id, data);
  }

  // 공지사항 삭제
  async deleteNotice(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }

  // 상단고정 토글
  async togglePin(id: number): Promise<Notice | null> {
    return await this.repository.togglePin(id);
  }

  // 첨부파일 처리
  private async handleAttachments(
    noticeId: number,
    files: File[]
  ): Promise<void> {
    const uploadDir = join(process.cwd(), "public", "notice-attachments");

    // 디렉토리 생성
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    for (const file of files) {
      try {
        // 파일 저장
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split(".").pop();
        const fileName = `${timestamp}_${randomString}.${fileExtension}`;
        const filePath = join(uploadDir, fileName);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // 데이터베이스에 첨부파일 정보 저장
        await this.repository.addAttachment(noticeId, {
          fileName: file.name,
          filePath: `/static-assets/notice-attachments/${fileName}`,
          fileSize: file.size,
          mimeType: file.type,
        });
      } catch (error) {
        console.error("첨부파일 처리 중 오류:", error);
      }
    }
  }

  // 단일 첨부파일 추가
  async addAttachment(noticeId: number, file: File): Promise<void> {
    const uploadDir = join(process.cwd(), "public", "notice-attachments");

    // 디렉토리 생성
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    try {
      // 파일 저장
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split(".").pop();
      const fileName = `${timestamp}_${randomString}.${fileExtension}`;
      const filePath = join(uploadDir, fileName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // 데이터베이스에 첨부파일 정보 저장
      await this.repository.addAttachment(noticeId, {
        fileName: file.name,
        filePath: `/static-assets/notice-attachments/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
      });
    } catch (error) {
      console.error("첨부파일 추가 중 오류:", error);
      throw error;
    }
  }

  // 첨부파일 다운로드
  async downloadAttachment(
    attachmentId: number
  ): Promise<{ filePath: string; fileName: string } | null> {
    const attachment = await this.repository.findAttachmentById(attachmentId);

    if (!attachment) return null;

    // 다운로드 횟수 증가
    await this.repository.incrementDownloadCount(attachmentId);

    return {
      filePath: attachment.filePath,
      fileName: attachment.fileName,
    };
  }

  // 첨부파일 삭제
  async deleteAttachment(attachmentId: number): Promise<boolean> {
    return await this.repository.deleteAttachment(attachmentId);
  }

  // 응답 형식 변환
  toResponse(notice: Notice) {
    return {
      id: notice.id,
      title: notice.title,
      content: notice.content,
      author: notice.author,
      isPinned: notice.isPinned,
      viewCount: notice.viewCount,
      isActive: notice.isActive,
      createdAt: notice.createdAt,
      updatedAt: notice.updatedAt,
      attachments: notice.attachments || [],
    };
  }
}
