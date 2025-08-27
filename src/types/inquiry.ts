export interface inquiry {
  id: number;
  title: string;
  content: string;
  author: string;
  email: string | null;
  isSecret: boolean;
  isAnswered: boolean;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface createInquiryRequest {
  title: string;
  content: string;
  author: string;
  email?: string;
  password?: string;
}

export interface updateInquiryRequest {
  title?: string;
  content?: string;
  author?: string;
  email?: string;
  isSecret?: boolean;
  password?: string;
}

export interface inquiryPasswordRequest {
  password: string;
}

export interface inquiryAnswerRequest {
  answer: string;
}
