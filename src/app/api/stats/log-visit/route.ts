import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 실제 클라이언트 IP 주소 가져오기 (서버 환경 대응)
function getClientIP(request: NextRequest): string | null {
  // Nginx 프록시 환경에서 실제 IP 가져오기
  const realIP = request.headers.get("X-Real-IP");
  const forwardedFor = request.headers.get("X-Forwarded-For");
  const cfConnectingIP = request.headers.get("CF-Connecting-IP"); // Cloudflare

  if (realIP) return realIP;
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  if (cfConnectingIP) return cfConnectingIP;

  // NextRequest에는 ip 속성이 없으므로 null 반환
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { userAgent, referer, path, isBot, botName } = await request.json();

    // 실제 클라이언트 IP 가져오기 (서버에서 정확한 IP 획득)
    const clientIP = getClientIP(request);

    // 방문자 로그 기록
    await prisma.visitorlog.create({
      data: {
        ip: clientIP,
        userAgent: userAgent || null,
        referer: referer || null,
        path: path || "/",
        isBot: isBot || false,
        botName: botName || null,
      },
    });

    return NextResponse.json({
      success: true,
      loggedIP: clientIP,
      note: "방문자 로그가 성공적으로 기록되었습니다.",
    });
  } catch (error) {
    console.error("방문자 로그 기록 실패:", error);
    return NextResponse.json(
      { error: "방문자 로그 기록에 실패했습니다." },
      { status: 500 }
    );
  }
}
