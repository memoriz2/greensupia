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
    <div className={`admin-portal ${inter.className}`}>
      {/* 헤더 */}
      <header>
        <nav>
          <div className="header-content">
            <div className="header-left">
              <h1 className="text-xl">JSEO 관리자 포털</h1>
            </div>
            <div className="header-right">
              <span className="user-info">관리자</span>
            </div>
          </div>
        </nav>
      </header>

      <div className="main-container">
        {/* 사이드바 */}
        <aside>
          <nav>
            <ul>
              <li>
                <a href="/portal">📊 대시보드</a>
              </li>
              <li>
                <a href="/portal/organization">🏢 조직도 관리</a>
              </li>
              <li>
                <a href="/portal/history">📅 히스토리 관리</a>
              </li>
              <li>
                <a href="/portal/banner-news">📰 배너뉴스 관리</a>
              </li>
              <li>
                <a href="/portal/todos">✅ Todo 관리</a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main>{children}</main>
      </div>

      {/* 푸터 */}
      <footer>
        <div className="footer-content">
          <span className="footer-logo">JSEO</span>
          <span className="footer-text">관리자 포털</span>
          <span className="footer-year">© 2024</span>
        </div>
      </footer>
    </div>
  );
}
