import { NextRequest, NextResponse } from "next/server";
// Edge Runtime 호환성을 위해 Node.js 전용 모듈 제거
// import { monitoringSystem } from "@/lib/monitoring";
// import { rateLimiter } from "@/lib/rateLimit";
// import { backupManager } from "@/lib/backup";
// import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    // Edge Runtime 호환성을 위해 간단한 시스템 정보만 반환
    const monitoringData = {
      timestamp: new Date().toISOString(),
      status: "edge-runtime-compatible",
      message: "Edge Runtime 호환 모니터링 API",
      note: "Node.js 전용 기능은 제거되었습니다.",
    };

    return NextResponse.json(monitoringData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "모니터링 정보를 가져오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
