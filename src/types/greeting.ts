export interface Greeting {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GreetingCreateRequest {
  title: string;
  content: string;
  isActive?: boolean;
}

export interface GreetingUpdateRequest {
  title?: string;
  content?: string;
  isActive?: boolean;
}

export interface GreetingResponse {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GreetingListResponse {
  content: GreetingResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
