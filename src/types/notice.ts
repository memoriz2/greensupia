export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  isPinned: boolean;
  viewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attachments?: NoticeAttachment[];
}

export interface NoticeAttachment {
  id: number;
  noticeId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  downloadCount: number;
  createdAt: string;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  author?: string;
  isPinned?: boolean;
  attachments?: File[];
}

export interface UpdateNoticeRequest {
  title?: string;
  content?: string;
  isPinned?: boolean;
  isActive?: boolean;
}

export interface NoticeListResponse {
  notices: Notice[];
  total: number;
  page: number;
  limit: number;
}
