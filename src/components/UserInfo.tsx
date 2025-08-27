"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionManager } from "@/hooks/useSessionManager";
import AutoLogoutModal from "./AutoLogoutModal";

export default function UserInfo() {
  const [userType, setUserType] = useState<string>("guest");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUserType(data.userType || "guest");
      } else {
        setUserType("guest");
      }
    } catch (err) {
      console.error("사용자 정보 가져오기 실패:", err);
      setUserType("guest");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUserType("guest");
      // 로그아웃 후 페이지 새로고침
      window.location.reload();
    } catch (err) {
      console.error("로그아웃 오류:", err);
      setUserType("guest");
    }
  };

  // 세션 관리 훅 사용 (관리자일 때만)
  const { showWarning, countdown, closeWarning } = useSessionManager({
    onLogout: handleLogout,
    sessionTimeout: 30 * 60 * 1000, // 30분
    warningTimeout: 10 * 1000, // 10초
  });

  useEffect(() => {
    fetchUserInfo();

    // 주기적으로 사용자 정보 확인 (1분마다)
    const interval = setInterval(() => {
      fetchUserInfo();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <div className="user-info-container">
        {userType === "guest" ? (
          <button
            onClick={() => router.push("/portal/login")}
            className="login-btn"
          >
            로그인
          </button>
        ) : (
          <button onClick={handleLogout} className="logout-btn">
            로그아웃
          </button>
        )}
      </div>

      {/* 자동 로그아웃 모달 */}
      {userType !== "guest" && (
        <AutoLogoutModal
          isOpen={showWarning}
          onClose={closeWarning}
          onLogout={handleLogout}
          countdown={countdown}
        />
      )}
    </>
  );
}
