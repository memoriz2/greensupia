export interface History {
  id: number;
  year: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHistoryRequest {
  year: string;
  description: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateHistoryRequest {
  year?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface HistoryFilters {
  year?: string;
  search?: string;
  isActive?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "year" | "sortOrder";
  sortOrder?: "asc" | "desc";
}

export interface HistoryState {
  histories: History[];
  loading: boolean;
  error: string | null;
  filters: HistoryFilters;
}
