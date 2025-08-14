import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import UserInfo from "../../components/UserInfo";
import "../../styles/globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "관리자 포털 - Greensupia",
  description: "Greensupia 관리자 포털 - 콘텐츠 관리 및 시스템 운영",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`admin-portal ${inter.className}`}>
      {/* 사이드바 토글 체크박스 (접근성용, CSS 토글) */}
      <input
        type="checkbox"
        id="sidebar-toggle"
        className="sr-only sidebar-toggle"
        aria-label="사이드바 열기/닫기"
      />
      {/* 헤더 */}
      <header>
        <nav>
          <div className="header-content">
            <div className="header-left">
              <Link href="/portal" className="portal-logo">
                <h1 className="portal-title">Greensupia 관리자 포털</h1>
              </Link>
            </div>
            <div className="header-right">
              {/* 햄버거 메뉴 (라벨로 체크박스 제어) - 우측 정렬 */}
              <label
                htmlFor="sidebar-toggle"
                className="hamburger-menu"
                aria-label="메뉴 열기"
                aria-controls="portal-sidebar"
              >
                <span></span>
                <span></span>
                <span></span>
              </label>
              <UserInfo />
            </div>
          </div>
        </nav>
      </header>

      <div className="main-container">
        {/* 사이드바 */}
        <aside id="portal-sidebar">
          <nav>
            <ul>
              <li>
                <Link href="/portal">📊 대시보드</Link>
              </li>
              <li>
                <Link href="/portal/notices">📢 공지사항 관리</Link>
              </li>
              <li>
                <Link href="/portal/videos">🎥 비디오 관리</Link>
              </li>
              <li>
                <Link href="/portal/banners">🖼️ 배너 관리</Link>
              </li>
              <li>
                <Link href="/portal/greetings">💬 인사말 관리</Link>
              </li>
              <li>
                <Link href="/portal/organization">🏢 조직도 관리</Link>
              </li>
              <li>
                <Link href="/portal/history">📅 히스토리 관리</Link>
              </li>
              <li>
                <Link href="/portal/banner-news">📰 배너뉴스 관리</Link>
              </li>
              <li>
                <Link href="/portal/inquiry">💬 문의하기 관리</Link>
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
          <span className="footer-logo">Greensupia</span>
          <span className="footer-text">관리자 포털</span>
          <span className="footer-year">© 2024</span>
        </div>
      </footer>
    </div>
  );
}
