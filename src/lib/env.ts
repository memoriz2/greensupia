// 환경변수는 .env 파일에서 관리
// 이 파일은 환경변수 타입 정의만 제공

export interface Env {
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL: string;
  PORT?: string;
  DOMAIN_URL?: string;
  MAIN_DOMAIN?: string;
  WWW_DOMAIN?: string;
  ADMIN_DOMAIN?: string;
}

// 환경변수 접근을 위한 헬퍼 함수
export function getEnvVar(key: keyof Env): string | undefined {
  return process.env[key];
}

// 필수 환경변수 확인
export function checkRequiredEnvVars(): void {
  const required = ["DATABASE_URL"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ 누락된 환경변수: ${missing.join(", ")}`);
    console.error("📝 .env 파일을 확인해주세요");
    throw new Error("필수 환경변수가 설정되지 않았습니다");
  }
}
