export interface History {
  id: number;
  year: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHistoryRequest {
  year: number;
  title: string;
  content: string;
}

export interface UpdateHistoryRequest {
  year?: number;
  title?: string;
  content?: string;
}

export interface HistoryFilters {
  year?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "year" | "title";
  sortOrder?: "asc" | "desc";
}

export interface HistoryState {
  histories: History[];
  loading: boolean;
  error: string | null;
  filters: HistoryFilters;
}
