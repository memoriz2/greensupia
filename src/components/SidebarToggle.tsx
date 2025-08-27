"use client";

import { useEffect } from "react";

export default function SidebarToggle() {
  // 메뉴 클릭 시 사이드바 자동 닫기
  useEffect(() => {
    const handleMenuClick = () => {
      const sidebarToggle = document.getElementById(
        "sidebar-toggle"
      ) as HTMLInputElement;
      if (sidebarToggle && window.innerWidth <= 1024) {
        sidebarToggle.checked = false;
      }
    };

    // 모든 메뉴 링크에 이벤트 리스너 추가
    const menuLinks = document.querySelectorAll("#portal-sidebar a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", handleMenuClick);
    });

    return () => {
      menuLinks.forEach((link) => {
        link.removeEventListener("click", handleMenuClick);
      });
    };
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않고 사이드바 토글 로직만 담당
  return null;
}
