export interface video {
  id: number;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface videoCreateRequest {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface videoUpdateRequest {
  title?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface videoResponse {
  id: number;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface videoListResponse {
  content: videoResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
