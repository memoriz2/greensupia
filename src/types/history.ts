export interface history {
  id: number;
  year: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface createHistoryRequest {
  year: string;
  description: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface updateHistoryRequest {
  year?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface historyFilters {
  year?: string;
  search?: string;
  isActive?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "year" | "sortOrder";
  sortOrder?: "asc" | "desc";
}

export interface historyState {
  histories: history[];
  loading: boolean;
  error: string | null;
  filters: historyFilters;
}
