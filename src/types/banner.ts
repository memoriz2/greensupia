export interface banner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface bannerCreateRequest {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface bannerUpdateRequest {
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface bannerResponse {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface bannerListResponse {
  content: bannerResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
