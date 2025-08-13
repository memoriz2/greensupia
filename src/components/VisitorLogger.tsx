"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorLogger() {
  const pathname = usePathname();

  useEffect(() => {
    const logVisit = async () => {
      try {
        // 봇 감지 (간단한 방식)
        const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);
        const botName = isBot ? navigator.userAgent : null;

        // 방문자 로그 기록 API 호출
        await fetch("/api/stats/log-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            userAgent: navigator.userAgent,
            referer: document.referrer || null,
            isBot,
            botName,
          }),
        });
      } catch (error) {
        console.error("방문자 로그 기록 실패:", error);
      }
    };

    // 페이지 방문 시 로그 기록
    logVisit();
  }, [pathname]);

  return null; // UI 렌더링 없음
}
