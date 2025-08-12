export interface notice {
  id: number;
  title: string;
  content: string;
  author: string;
  isPinned: boolean;
  viewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attachments?: noticeattachment[];
}

export interface noticeattachment {
  id: number;
  noticeId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  downloadCount: number;
  createdAt: string;
}

export interface createNoticeRequest {
  title: string;
  content: string;
  author?: string;
  isPinned?: boolean;
  attachments?: File[];
}

export interface updateNoticeRequest {
  title?: string;
  content?: string;
  isPinned?: boolean;
  isActive?: boolean;
}

export interface noticeListResponse {
  notices: notice[];
  total: number;
  page: number;
  limit: number;
}
