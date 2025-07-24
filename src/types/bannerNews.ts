export interface BannerNews {
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

export interface CreateBannerNewsRequest {
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateBannerNewsRequest {
  title?: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface BannerNewsFilters {
  isActive?: boolean;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface BannerNewsState {
  bannerNews: BannerNews[];
  loading: boolean;
  error: string | null;
  filters: BannerNewsFilters;
}
