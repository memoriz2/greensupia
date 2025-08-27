"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorLogger() {
  const pathname = usePathname();

  useEffect(() => {
    const logVisit = async () => {
      try {
        // 봇 감지 (더 정확한 방식)
        const userAgent = navigator.userAgent;
        const isBot =
          /bot|crawler|spider|googlebot|bingbot|naverbot|yetibot|msnbot|yeti|daum|daumoa|scraper/i.test(
            userAgent.toLowerCase()
          );

        if (isBot) {
          // 봇 감지 시 봇 전용 API 호출
          const botName = getBotName(userAgent);
          await fetch("/api/stats/log-bot-visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: pathname,
              userAgent: userAgent,
              referer: document.referrer || null,
              botName: botName,
            }),
          });
        } else {
          // 일반 사용자 방문 로그 기록
          await fetch("/api/stats/log-visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: pathname,
              userAgent: userAgent,
              referer: document.referrer || null,
              isBot: false,
              botName: null,
            }),
          });
        }
      } catch (error) {
        console.error("방문자 로그 기록 실패:", error);
      }
    };

    // 페이지 방문 시 로그 기록
    logVisit();
  }, [pathname]);

  return null; // UI 렌더링 없음
}

// 봇 이름 식별 함수 (미들웨어와 동일한 로직)
function getBotName(userAgent: string): string {
  const userAgentLower = userAgent.toLowerCase();

  if (
    userAgentLower.includes("googlebot") ||
    userAgentLower.includes("google-bot")
  ) {
    return "GoogleBot";
  }

  if (userAgentLower.includes("bingbot") || userAgentLower.includes("msnbot")) {
    return "BingBot";
  }

  if (userAgentLower.includes("daum") || userAgentLower.includes("daumoa")) {
    return "DaumBot";
  }

  if (
    userAgentLower.includes("naverbot") ||
    userAgentLower.includes("yetibot") ||
    userAgentLower.includes("yeti") ||
    (userAgentLower.includes("naver.me/bot") &&
      !userAgentLower.includes("daum")) ||
    (userAgentLower.includes("help.naver.com/robots") &&
      !userAgentLower.includes("daum"))
  ) {
    return "NaverBot";
  }

  if (/bot|crawler|spider|scraper/i.test(userAgentLower)) {
    return "기타봇";
  }

  return "알 수 없는 봇";
}
