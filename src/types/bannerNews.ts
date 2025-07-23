export interface BannerNews {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBannerNewsRequest {
  title: string;
  content: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateBannerNewsRequest {
  title?: string;
  content?: string;
  imageUrl?: string;
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
