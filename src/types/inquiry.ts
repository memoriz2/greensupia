export interface Inquiry {
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

export interface CreateInquiryRequest {
  title: string;
  content: string;
  author: string;
  email?: string;
  password?: string;
}

export interface UpdateInquiryRequest {
  title?: string;
  content?: string;
  author?: string;
  email?: string;
  isSecret?: boolean;
  password?: string;
}

export interface InquiryPasswordRequest {
  password: string;
}

export interface InquiryAnswerRequest {
  answer: string;
}
