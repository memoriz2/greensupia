import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 봇 감지 함수
function isBot(userAgent: string): { isBot: boolean; botName: string | null } {
  if (!userAgent) return { isBot: false, botName: null };

  // 4개 주요 봇만 구체적으로 분류
  if (/googlebot/i.test(userAgent)) {
    return { isBot: true, botName: "GoogleBot" };
  }
  if (/bingbot/i.test(userAgent)) {
    return { isBot: true, botName: "BingBot" };
  }
  if (/naver/i.test(userAgent)) {
    return { isBot: true, botName: "NaverBot" };
  }
  if (/daum/i.test(userAgent)) {
    return { isBot: true, botName: "DaumBot" };
  }

  // 나머지 모든 봇은 '기타봇'으로 처리
  if (
    /bot|crawler|spider|crawling|externalhit|slurp|duckduckbot|facebook|twitter|linkedin|whatsapp|telegram|discord|slack|line|kakaotalk|zum|searchenginerobot|semrushbot|ahrefsbot|mj12bot|dotbot|rogerbot|exabot|gigabot|ia_archiver|archive\.org|wayback|baiduspider|yandexbot|sogou|360spider|bytespider|ucweb|qqbrowser|maxthon|opera mini|puffin|dolphin|mercury|phantomjs|headless|selenium|webdriver|puppeteer|playwright|cypress|jest|mocha|karma|protractor|nightwatch|testcafe|ranorex|sikuli|appium|calabash|espresso|xctest|ui automation|monkeyrunner|robotium|frank|kif|xamarin\.testcloud|perfecto|browserstack|saucelabs|crossbrowsertesting|lambdatest|testingbot|browsermob|ghost inspector|katalon studio|testcomplete/i.test(
      userAgent
    )
  ) {
    return { isBot: true, botName: "기타봇" };
  }

  return { isBot: false, botName: null };
}

export async function middleware(request: NextRequest) {
  try {
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

    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const path = request.nextUrl.pathname;

    // 봇 감지
    const { isBot: isBotUser, botName } = isBot(userAgent);

    // 방문자 로그를 데이터베이스에 저장
    try {
      await fetch(`${request.nextUrl.origin}/api/stats/log-visit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ip,
          userAgent,
          referer,
          path,
          isBot: isBotUser,
          botName,
        }),
      });
    } catch (error) {
      // 로그 기록 실패해도 페이지 로딩은 계속
      console.error("방문자 로그 기록 실패:", error);
    }
  } catch (error) {
    console.error("미들웨어 오류:", error);
  }

  return NextResponse.next();
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
};
