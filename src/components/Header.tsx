"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // 스크롤 이벤트 최적화 - debounce 적용
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolled(window.scrollY > 10);
    }, 16); // 60fps에 맞춘 최적화
  }, []);

  useEffect(() => {
    // passive: true로 성능 향상
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // 모바일 메뉴 토글 최적화
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // 메뉴 닫기 함수
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // 메뉴 아이템 메모이제이션
  const menuItems = useMemo(
    () => [
      { href: "/", label: "홈" },
      { href: "/notice", label: "공지사항" },
      { href: "/inquiry", label: "문의하기" },
    ],
    []
  );

  return (
    <header
      className={`greensupia-header ${
        isScrolled ? "greensupia-header--scrolled" : ""
      }`}
    >
      <div className="greensupia-header__container">
        <div className="greensupia-header__content">
          {/* 로고 */}
          <Link href="/" className="greensupia-header__logo">
            <div className="greensupia-header__logo-icon">G</div>
            <span className="greensupia-header__logo-text">Greensupia</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="greensupia-header__nav">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="greensupia-header__nav-item"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 모바일 메뉴 토글 */}
          <button
            className="greensupia-header__mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="메뉴 열기"
            aria-expanded={isMobileMenuOpen}
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
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="greensupia-header__nav-item"
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
