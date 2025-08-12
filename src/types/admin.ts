export interface admin {
  id: number;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface createAdminRequest {
  username: string;
  email: string;
  password: string;
  isActive?: boolean;
}

export interface updateAdminRequest {
  username?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
}

export interface adminResponse {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface adminListResponse {
  content: adminResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
