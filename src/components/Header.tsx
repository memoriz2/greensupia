"use client";

import Link from "next/link";
import Image from "next/image";
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
      { href: "/greensupia", label: "그린수피아" },
      { href: "/material-tech", label: "소재·기술" },
      { href: "/products", label: "제품" },
      { href: "/solutions", label: "솔루션" },
      { href: "/support", label: "고객지원" },
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
            <Image
              src="/main_03.jpg"
              alt="Greensupia"
              width={137}
              height={41}
              priority
              className="greensupia-header__logo-image"
            />
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
