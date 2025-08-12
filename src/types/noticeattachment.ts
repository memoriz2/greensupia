export interface noticeattachment {
  id: number;
  noticeId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface createNoticeattachmentRequest {
  noticeId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

export interface updateNoticeattachmentRequest {
  noticeId?: number;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface noticeattachmentResponse {
  id: number;
  noticeId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface noticeattachmentListResponse {
  content: noticeattachmentResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
