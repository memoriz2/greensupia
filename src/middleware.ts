import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge Runtime 호환성을 위해 모든 Node.js 전용 기능 제거
// 가장 기본적인 기능만 유지

export async function middleware(request: NextRequest) {
  try {
    // Edge Runtime 호환성을 위해 process.env 사용 제거
    // HTTPS 강제 리다이렉트는 제거 (Edge Runtime에서 지원하지 않음)

    // 정적 파일이나 API 요청, 관리자 경로는 제외
    if (
      request.nextUrl.pathname.startsWith("/_next") ||
      request.nextUrl.pathname.startsWith("/api") ||
      request.nextUrl.pathname.startsWith("/favicon.ico") ||
      request.nextUrl.pathname.startsWith("/portal") || // 관리자 경로 제외
      request.nextUrl.pathname.includes(".") ||
      request.nextUrl.pathname.includes("robots.txt") ||
      request.nextUrl.pathname.includes("sitemap.xml")
    ) {
      return NextResponse.next();
    }

    // 봇 감지 및 로깅
    const userAgent = request.headers.get("user-agent") || "";
    const isBot =
      /bot|crawler|spider|googlebot|bingbot|naverbot|yetibot|msnbot|yeti|daum|daumoa|scraper/i.test(
        userAgent.toLowerCase()
      );

    if (isBot) {
      // PM2 로그에 봇 감지 기록
      const botName = getBotName(userAgent);
      console.log(
        `[봇 감지] ${new Date().toISOString()} - User-Agent: ${userAgent} - Path: ${
          request.nextUrl.pathname
        } - Bot: ${botName}`
      );

      // Edge Runtime에서는 fetch API가 제한적이므로 로깅만 수행
      // 실제 DB 저장은 별도 방법으로 처리 필요
      // TODO: 봇 방문 통계를 위한 대안 방법 구현
    }

    // Edge Runtime 호환성을 위해 모든 복잡한 로직 제거
    // 가장 기본적인 요청 처리만 수행
  } catch (error) {
    // Edge Runtime 호환성을 위해 에러 로깅 제거
    // console.error도 Edge Runtime에서 문제가 될 수 있음
    console.log(`[미들웨어 에러] ${error}`);
  }

  return NextResponse.next();
}

// 봇 이름 식별 함수
function getBotName(userAgent: string): string {
  const userAgentLower = userAgent.toLowerCase();

  // GoogleBot 감지 (가장 정확한 패턴부터)
  if (
    userAgentLower.includes("googlebot") ||
    userAgentLower.includes("google-bot")
  ) {
    return "GoogleBot";
  }

  // BingBot 감지
  if (userAgentLower.includes("bingbot") || userAgentLower.includes("msnbot")) {
    return "BingBot";
  }

  // DaumBot 감지 (NaverBot보다 먼저 체크)
  if (userAgentLower.includes("daum") || userAgentLower.includes("daumoa")) {
    return "DaumBot";
  }

  // NaverBot 감지 (더 정확한 패턴)
  if (
    userAgentLower.includes("naverbot") ||
    userAgentLower.includes("yetibot") ||
    userAgentLower.includes("yeti") ||
    (userAgentLower.includes("naver.me/bot") &&
      !userAgentLower.includes("daum")) ||
    (userAgentLower.includes("help.naver.com/robots") &&
      !userAgentLower.includes("daum"))
  ) {
    return "NaverBot";
  }

  // 기타 봇 감지 (더 구체적인 패턴)
  if (/bot|crawler|spider|scraper/i.test(userAgentLower)) {
    return "기타봇";
  }

  return "알 수 없는 봇";
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
  runtime: "experimental-edge", // Next.js 15에서 Edge Runtime 사용
};
