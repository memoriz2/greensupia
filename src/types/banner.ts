export interface banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface bannerCreateRequest {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface bannerUpdateRequest {
  title?: string;
  imageUrl?: string;
  linkUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface bannerResponse {
  id: number;
  title: string;
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
