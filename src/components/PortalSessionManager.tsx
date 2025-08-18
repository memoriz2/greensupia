"use client";

import { useSessionManager } from "@/hooks/useSessionManager";
import AutoLogoutModal from "./AutoLogoutModal";

export default function PortalSessionManager() {
  // 세션 관리 훅 사용
  const { showWarning, countdown, closeWarning } = useSessionManager({
    onLogout: () => {
      // 로그아웃 처리
      window.location.href = "/portal/login";
    },
    sessionTimeout: 30 * 60 * 1000, // 30분
    warningTimeout: 10 * 1000, // 10초
  });

  return (
    <AutoLogoutModal
      isOpen={showWarning}
      onClose={closeWarning}
      onLogout={() => (window.location.href = "/portal/login")}
      countdown={countdown}
    />
  );
}
