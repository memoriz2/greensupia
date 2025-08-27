export interface bannerNews {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface createBannerNewsRequest {
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface updateBannerNewsRequest {
  title?: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface bannerNewsFilters {
  isActive?: boolean;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface bannerNewsState {
  bannerNewsItem: bannerNews[];
  loading: boolean;
  error: string | null;
  filters: bannerNewsFilters;
}
