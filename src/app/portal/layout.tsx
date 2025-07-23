import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "관리자 포털 - JSEO",
  description: "JSEO 관리자 포털",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`admin-portal min-h-screen bg-gray-50 ${inter.className}`}>
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="관리자 메인 네비게이션"
        >
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                JSEO 관리자 포털
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500" aria-label="현재 사용자">
                관리자
              </span>
            </div>
          </div>
        </nav>
      </header>

      <div className="flex">
        {/* 사이드바 */}
        <aside
          className="w-64 bg-white shadow-sm min-h-screen"
          aria-label="관리자 메뉴"
        >
          <nav className="mt-8" aria-label="관리자 사이드바 네비게이션">
            <ul className="px-4 space-y-2" role="list">
              <li role="listitem">
                <a
                  href="/portal"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  aria-label="대시보드로 이동"
                >
                  📊 대시보드
                </a>
              </li>
              <li role="listitem">
                <a
                  href="/portal/organization"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  aria-label="조직도 관리 페이지로 이동"
                >
                  🏢 조직도 관리
                </a>
              </li>
              <li role="listitem">
                <a
                  href="/portal/history"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  aria-label="히스토리 관리 페이지로 이동"
                >
                  📅 히스토리 관리
                </a>
              </li>
              <li role="listitem">
                <a
                  href="/portal/banner-news"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  aria-label="배너뉴스 관리 페이지로 이동"
                >
                  📰 배너뉴스 관리
                </a>
              </li>
              <li role="listitem">
                <a
                  href="/portal/todos"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  aria-label="Todo 관리 페이지로 이동"
                >
                  ✅ Todo 관리
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-8" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
