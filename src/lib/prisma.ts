import { PrismaClient } from "@prisma/client";
import { checkSecurityStatus } from "./env";

// 글로벌 타입 정의
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 클라이언트 생성 (최적화된 설정)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // 개발 환경에서만 로그 출력
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],

    // 에러 포맷 설정
    errorFormat: "pretty",

    // 연결 풀 설정
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// 개발 환경에서만 글로벌에 저장 (핫 리로드 방지)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// 환경변수 보안 상태 확인 (프로덕션에서만)
if (process.env.NODE_ENV === "production") {
  try {
    checkSecurityStatus();
  } catch (error) {
    console.error("❌ 프로덕션 환경변수 보안 검증 실패:", error);
    process.exit(1); // 보안 검증 실패 시 애플리케이션 종료
  }
}

// 연결 테스트 및 상태 관리
class PrismaManager {
  private static instance: PrismaManager;
  private isConnected = false;
  private connectionAttempts = 0;
  private maxRetries = 3;

  static getInstance(): PrismaManager {
    if (!PrismaManager.instance) {
      PrismaManager.instance = new PrismaManager();
    }
    return PrismaManager.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      await prisma.$connect();
      this.isConnected = true;
      this.connectionAttempts = 0;
      console.log("✅ Prisma DB 연결 성공");
    } catch (error) {
      this.connectionAttempts++;
      console.error(
        `❌ Prisma DB 연결 실패 (시도 ${this.connectionAttempts}/${this.maxRetries}):`,
        error
      );

      if (this.connectionAttempts < this.maxRetries) {
        console.log("🔄 재연결 시도 중...");
        setTimeout(() => this.connect(), 2000);
      } else {
        console.error("💥 최대 재연결 시도 횟수 초과");
        throw new Error("데이터베이스 연결 실패");
      }
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await prisma.$disconnect();
      this.isConnected = false;
      console.log("🔌 Prisma DB 연결 해제");
    } catch (error) {
      console.error("❌ Prisma DB 연결 해제 실패:", error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

// Prisma 매니저 인스턴스
export const prismaManager = PrismaManager.getInstance();

// 애플리케이션 시작 시 자동 연결
if (typeof window === "undefined") {
  prismaManager.connect().catch(console.error);
}

// 프로세스 종료 시 정리
process.on("beforeExit", async () => {
  await prismaManager.disconnect();
});

process.on("SIGINT", async () => {
  await prismaManager.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prismaManager.disconnect();
  process.exit(0);
});

export default prisma;
