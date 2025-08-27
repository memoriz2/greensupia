// 환경변수는 .env 파일에서 관리
// 이 파일은 환경변수 타입 정의만 제공

export interface Env {
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL: string;
  JWT_SECRET: string;
  ENCRYPTION_KEY: string;
  PORT?: string;
  DOMAIN_URL?: string;
  MAIN_DOMAIN?: string;
  WWW_DOMAIN?: string;
  ADMIN_DOMAIN?: string;

  // 로깅 설정
  LOG_LEVEL?: "debug" | "info" | "warn" | "error" | "fatal";
  LOG_FILE_PATH?: string;

  // 백업 설정
  BACKUP_DIR?: string;
  MAX_BACKUPS?: string;
  BACKUP_INTERVAL?: string;
  BACKUP_RETENTION_DAYS?: string;
  ENABLE_AUTO_BACKUP?: string;

  // 모니터링 설정
  MONITORING_API_KEY?: string;

  // 이메일 설정
  GMAIL_USER?: string;
  GMAIL_APP_PASSWORD?: string;
  EMAIL_FROM_NAME?: string;

  // Google Maps API
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;

  // 사이트 URL
  NEXT_PUBLIC_SITE_URL?: string;
}

// 환경변수 접근을 위한 헬퍼 함수
export function getEnvVar(key: keyof Env): string | undefined {
  return process.env[key];
}

// 필수 환경변수 확인
export function checkRequiredEnvVars(): void {
  const required = ["DATABASE_URL", "JWT_SECRET", "ENCRYPTION_KEY"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ 누락된 환경변수: ${missing.join(", ")}`);
    console.error("📝 .env 파일을 확인해주세요");
    throw new Error("필수 환경변수가 설정되지 않았습니다");
  }
}

// JWT_SECRET 검증 함수
export function getJWTSecret(): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("❌ JWT_SECRET 환경변수가 설정되지 않았습니다");
    throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다");
  }

  // 최소 길이 검증 (32자 이상 권장)
  if (jwtSecret.length < 16) {
    console.warn("⚠️ JWT_SECRET이 너무 짧습니다. 32자 이상을 권장합니다");
  }

  return jwtSecret;
}

// ENCRYPTION_KEY 검증 함수
export function getEncryptionKey(): string {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    console.error("❌ ENCRYPTION_KEY 환경변수가 설정되지 않았습니다");
    throw new Error("ENCRYPTION_KEY 환경변수가 설정되지 않았습니다");
  }

  // 최소 길이 검증 (32자 이상 권장)
  if (encryptionKey.length < 16) {
    console.warn("⚠️ ENCRYPTION_KEY가 너무 짧습니다. 32자 이상을 권장합니다");
  }

  return encryptionKey;
}

// 환경변수 보안 상태 확인
export function checkSecurityStatus(): void {
  console.log("🔒 환경변수 보안 상태 확인 중...");

  try {
    checkRequiredEnvVars();
    getJWTSecret();
    getEncryptionKey();
    console.log("✅ 모든 필수 환경변수가 안전하게 설정되었습니다");
  } catch (error) {
    console.error("❌ 환경변수 보안 검증 실패:", error);
    throw error;
  }
}

// 환경변수 설정 가이드 출력
export function printEnvSetupGuide(): void {
  console.log(`
📋 환경변수 설정 가이드

🔐 필수 보안 설정:
  JWT_SECRET=매우_복잡한_랜덤_문자열_32자_이상
  ENCRYPTION_KEY=매우_복잡한_랜덤_문자열_32자_이상

🗄️ 데이터베이스 설정:
  DATABASE_URL=mysql://username:password@host:port/database

🌐 도메인 설정:
  DOMAIN_URL=https://greensupia.com
  MAIN_DOMAIN=greensupia.com
  WWW_DOMAIN=www.greensupia.com

📊 로깅 설정:
  LOG_LEVEL=info
  LOG_FILE_PATH=./logs/app.log

💾 백업 설정:
  BACKUP_DIR=./backups
  MAX_BACKUPS=10
  BACKUP_INTERVAL=86400000
  BACKUP_RETENTION_DAYS=30
  ENABLE_AUTO_BACKUP=true

📈 모니터링 설정:
  MONITORING_API_KEY=모니터링_접근_키

📧 이메일 설정:
  GMAIL_USER=your-email@gmail.com
  GMAIL_APP_PASSWORD=your-gmail-app-password
  EMAIL_FROM_NAME=Greensupia

🗺️ Google Maps API:
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

🌍 사이트 URL:
  NEXT_PUBLIC_SITE_URL=https://greensupia.com
`);
}
