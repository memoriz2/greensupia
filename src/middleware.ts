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

    // Edge Runtime 호환성을 위해 모든 복잡한 로직 제거
    // 가장 기본적인 요청 처리만 수행
  } catch {
    // Edge Runtime 호환성을 위해 에러 로깅 제거
    // console.error도 Edge Runtime에서 문제가 될 수 있음
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
  runtime: "experimental-edge", // Next.js 15에서 Edge Runtime 사용
};
