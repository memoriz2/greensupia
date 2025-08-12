export interface greeting {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface greetingCreateRequest {
  title: string;
  content: string;
  isActive?: boolean;
}

export interface greetingUpdateRequest {
  title?: string;
  content?: string;
  isActive?: boolean;
}

export interface greetingResponse {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface greetingListResponse {
  content: greetingResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
