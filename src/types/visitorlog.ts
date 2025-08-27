export interface visitorlog {
  id: number;
  ipAddress: string;
  userAgent?: string;
  page: string;
  referer?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface createVisitorlogRequest {
  ipAddress: string;
  userAgent?: string;
  page: string;
  referer?: string;
  timestamp?: Date;
}

export interface updateVisitorlogRequest {
  ipAddress?: string;
  userAgent?: string;
  page?: string;
  referer?: string;
  timestamp?: Date;
}

export interface visitorlogResponse {
  id: number;
  ipAddress: string;
  userAgent?: string;
  page: string;
  referer?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface visitorlogListResponse {
  content: visitorlogResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
