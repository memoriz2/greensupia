import { InquiryRepository } from "@/repositories/inquiryRepository";
import { Id } from "@/types/utils";
import { encrypt, decrypt, hashPassword } from "@/utils/encryption";
import { emailService } from "@/utils/emailService";
import { prisma } from "@/lib/prisma";

// Inquiry 인터페이스 정의
interface Inquiry {
  id: number;
  title: string;
  content: string;
  author: string;
  email: string | null;
  isSecret: boolean;
  isAnswered: boolean;
  answer: string | null;
  answeredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class InquiryService {
  private repository: InquiryRepository;

  constructor() {
    this.repository = new InquiryRepository(prisma);
  }

  // 비밀글 생성(암호화 포함)
  async createSecretInquiry(data: {
    title: string;
    content: string;
    author: string;
    email?: string;
    password: string;
  }) {
    // 1.이메일 암호화
    const encryptionKey =
      process.env.ENCRYPTION_KEY || "default-key-change-in-production";
    const encryptedEmail = data.email
      ? encrypt(data.email, encryptionKey)
      : undefined;

    // 2. 비밀번호 해싱
    const hashedPassword = hashPassword(data.password);

    // 3. Repository 호출
    const inquiry = await this.repository.create({
      ...data,
      email: encryptedEmail,
      password: hashedPassword,
      isSecret: true,
    });

    // 4. 관리자 알림은 대시보드에서 실시간 확인 가능하므로 제거

    return inquiry;
  }

  // 일반글 생성
  async createPublicInquiry(data: {
    title: string;
    content: string;
    author: string;
    email?: string;
  }) {
    // 이메일 암호화
    const encryptionKey =
      process.env.ENCRYPTION_KEY || "default-key-change-in-production";
    const encryptedEmail = data.email
      ? encrypt(data.email, encryptionKey)
      : undefined;

    const inquiry = await this.repository.create({
      ...data,
      email: encryptedEmail,
      isSecret: false,
    });

    // 관리자 알림은 대시보드에서 실시간 확인 가능하므로 제거

    return inquiry;
  }

  // 비밀글 비밀번호 확인
  async verifyInquiryPassword(id: Id, password: string) {
    const inquiry = await this.repository.findById(id);
    if (!inquiry || !inquiry.isSecret) {
      throw new Error("비밀글이 아닙니다.");
    }

    return this.repository.verifyPassword(id, password);
  }

  // 답변 추가
  async addAnswer(id: Id, answer: string) {
    const inquiry = await this.repository.findById(id);
    if (!inquiry) {
      throw new Error("문의글을 찾을 수 없습니다.");
    }

    return this.repository.addAnswer(id, answer);
  }

  // 문의글 수정
  async updateInquiry(
    id: Id,
    data: {
      title: string;
      content: string;
      author: string;
      email?: string;
      isSecret: boolean;
      password?: string;
    }
  ) {
    const inquiry = await this.repository.findById(id);
    if (!inquiry) {
      throw new Error("문의글을 찾을 수 없습니다.");
    }

    // 이메일 암호화 (새로 입력된 경우에만)
    const encryptionKey =
      process.env.ENCRYPTION_KEY || "default-key-change-in-production";
    const encryptedEmail = data.email
      ? encrypt(data.email, encryptionKey)
      : inquiry.email;

    // 비밀번호 해싱 (새로 입력된 경우에만)
    const hashedPassword = data.password
      ? hashPassword(data.password)
      : inquiry.password;

    return this.repository.update(id, {
      title: data.title,
      content: data.content,
      author: data.author,
      email: encryptedEmail,
      isSecret: data.isSecret,
      password: hashedPassword,
    });
  }

  // 시스템 내부용 - 알림 발송 전용 (이메일 복호화)
  private async getEmailForNotification(id: Id): Promise<string | null> {
    const inquiry = await this.repository.findById(id);
    if (!inquiry?.email) return null;

    const encryptionKey =
      process.env.ENCRYPTION_KEY || "default-key-change-in-production";
    return decrypt(inquiry.email, encryptionKey);
  }

  // 답변 추가 + 알림 발송 (시스템 내부에서만 복호화)
  async addAnswerWithNotification(id: Id, answer: string) {
    const updatedInquiry = await this.addAnswer(id, answer);

    // 알림 발송 (시스템 내부에서만 복호화)
    const email = await this.getEmailForNotification(id);
    if (email) {
      await this.sendNotificationEmail(email, updatedInquiry);
    }

    return updatedInquiry;
  }

  // 이메일 알림 발송 (시스템 내부용)
  private async sendNotificationEmail(
    email: string,
    inquiry: {
      id: number;
      title: string;
      content: string;
      author: string;
      email: string | null;
      isSecret: boolean;
      isAnswered: boolean;
      answer: string | null;
      answeredAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }
  ) {
    try {
      // 이메일 템플릿 생성
      const emailContent = emailService.generateInquiryAnswerEmail(
        inquiry.title,
        inquiry.content,
        inquiry.answer || "",
        inquiry.author
      );

      // 수신자 이메일 설정
      emailContent.to = email;

      // 이메일 발송
      const success = await emailService.sendEmail(emailContent);

      if (success) {
        console.log(`📧 답변 알림 메일 발송 성공: ${email}`);
      } else {
        console.error(`📧 답변 알림 메일 발송 실패: ${email}`);
      }
    } catch (error) {
      console.error("📧 이메일 발송 중 오류:", error);
    }
  }

  // 통계 조회
  async getInquiryStats() {
    const [total, pending, secret] = await Promise.all([
      this.repository.getTotalCount(),
      this.repository.getPendingCount(),
      this.repository.getSecretCount(),
    ]);

    return { total, pending, secret };
  }

  // toResponse() 메서드 (API 응답용)
  toResponse(inquiry: {
    id: number;
    title: string;
    content: string;
    author: string;
    email: string | null;
    isSecret: boolean;
    isAnswered: boolean;
    answer: string | null;
    answeredAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: inquiry.id,
      title: inquiry.title,
      content: inquiry.content,
      author: inquiry.author,
      isSecret: inquiry.isSecret,
      isAnswered: inquiry.isAnswered,
      createdAt: inquiry.createdAt.toISOString(),
      updatedAt: inquiry.updatedAt.toISOString(),
      // 이메일은 필요시에만 복호화하여 반환
    };
  }
}
