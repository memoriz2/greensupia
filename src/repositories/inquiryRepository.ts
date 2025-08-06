import { PrismaClient, Inquiry } from "@prisma/client";
import { IRepository } from "./baseRepository";
import { Id } from "@/types/utils";

export class InquiryRepository implements IRepository<Inquiry> {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: Id): Promise<Inquiry | null> {
    return this.prisma.inquiry.findUnique({
      where: { id },
    });
  }

  async create(data: {
    title: string;
    content: string;
    author: string;
    email?: string;
    isSecret: boolean;
    password?: string;
  }): Promise<Inquiry> {
    return this.prisma.inquiry.create({
      data,
    });
  }

  async update(id: Id, data: Partial<Inquiry>): Promise<Inquiry> {
    return this.prisma.inquiry.update({
      where: { id },
      data,
    });
  }

  async delete(id: Id): Promise<void> {
    await this.prisma.inquiry.delete({
      where: { id },
    });
  }

  async exists(id: Id): Promise<boolean> {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!inquiry;
  }

  //추가 메서드들
  async findByAnswerStatus(isAnswered: boolean): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany({
      where: { isAnswered },
      orderBy: { createdAt: "desc" },
    });
  }

  async findBySecretStatus(isSecret: boolean): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany({
      where: { isSecret },
      orderBy: { createdAt: "desc" },
    });
  }

  async addAnswer(id: Id, answer: string): Promise<Inquiry> {
    return this.prisma.inquiry.update({
      where: { id },
      data: {
        answer,
        isAnswered: true,
        answeredAt: new Date(),
      },
    });
  }

  async verifyPassword(id: Id, password: string): Promise<boolean> {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
      select: { password: true },
    });

    if (!inquiry?.password) {
      return false;
    }

    // verifyPassword 함수 사용 (암호화 유틸리티에서)
    const { verifyPassword } = await import("@/utils/encryption");
    return verifyPassword(password, inquiry.password);
  }

  // 통계 메서드들
  async getTotalCount(): Promise<number> {
    return this.prisma.inquiry.count();
  }

  async getPendingCount(): Promise<number> {
    return this.prisma.inquiry.count({
      where: { isAnswered: false },
    });
  }

  async getSecretCount(): Promise<number> {
    return this.prisma.inquiry.count({
      where: { isSecret: true },
    });
  }
}
