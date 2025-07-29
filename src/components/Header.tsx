"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`greensupia-header ${
        isScrolled ? "greensupia-header--scrolled" : ""
      }`}
    >
      <div className="greensupia-header__container">
        <div className="greensupia-header__content">
          {/* 로고 */}
          <Link href="/greensupia" className="greensupia-header__logo">
            <div className="greensupia-header__logo-icon">G</div>
            <span className="greensupia-header__logo-text">Greensupia</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="greensupia-header__nav">
            <Link href="/greensupia" className="greensupia-header__nav-item">
              홈
            </Link>
            <Link
              href="/greensupia/notice"
              className="greensupia-header__nav-item"
            >
              공지사항
            </Link>
            <Link
              href="/greensupia/contact"
              className="greensupia-header__nav-item"
            >
              문의하기
            </Link>
          </nav>

          {/* 모바일 메뉴 토글 */}
          <button
            className="greensupia-header__mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        <div
          className={`greensupia-header__mobile-menu ${
            isMobileMenuOpen ? "greensupia-header__mobile-menu--open" : ""
          }`}
        >
          <Link href="/greensupia" className="greensupia-header__nav-item">
            홈
          </Link>
          <Link
            href="/greensupia/notice"
            className="greensupia-header__nav-item"
          >
            공지사항
          </Link>
          <Link
            href="/greensupia/projects"
            className="greensupia-header__nav-item"
          >
            프로젝트
          </Link>
          <Link
            href="/greensupia/contact"
            className="greensupia-header__nav-item"
          >
            문의하기
          </Link>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Link
              href="/greensupia/contact"
              className="greensupia-header__cta-button greensupia-header__cta-button--primary"
            >
              무료 견적
            </Link>
            <Link
              href="/portal"
              className="greensupia-header__cta-button greensupia-header__cta-button--secondary"
            >
              관리자
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
