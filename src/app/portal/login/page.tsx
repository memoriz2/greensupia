"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  userType?: "admin" | "guest";
}

export default function PortalLoginPage() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<"admin" | "guest">("admin");
  const [currentUserType, setCurrentUserType] = useState<string>("guest");

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          const userTypeFromServer = data.userType || "guest";
          setCurrentUserType(userTypeFromServer);

          // 현재 사용자 타입에 따라 선택 옵션 설정
          setUserType(userTypeFromServer as "admin" | "guest");
        }
      } catch (err) {
        console.error("현재 사용자 정보 가져오기 실패:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserTypeChange = (type: "admin" | "guest") => {
    setUserType(type);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...loginForm,
          userType,
        }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.token) {
        // 서버에서 httpOnly 쿠키를 설정했으므로 클라이언트에서는 userType만 저장
        localStorage.setItem("userType", data.userType || userType);

        // 현재 사용자 타입 업데이트
        setCurrentUserType(data.userType || userType);

        // 로그인 성공 후 대시보드로 이동하고 페이지 새로고침
        router.push("/portal");
        // 페이지 새로고침으로 사용자 정보 업데이트
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError(data.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="portal-login">
      <div className="portal-login__container">
        <div className="portal-login__header">
          <h1 className="portal-login__title">관리자 로그인</h1>
          <p className="portal-login__description">
            그린수피아 관리자 페이지에 로그인하세요
          </p>
          {currentUserType !== "guest" && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                현재 {currentUserType === "admin" ? "관리자" : "게스트"}로
                로그인되어 있습니다.
              </p>
            </div>
          )}
        </div>

        <div className="portal-login__content">
          <div className="portal-login__card">
            {/* 사용자 타입 선택 */}
            <div className="portal-login__user-type-selector">
              <div className="portal-login__user-type-options">
                <button
                  type="button"
                  className={`portal-login__user-type-option ${
                    userType === "admin" ? "active" : ""
                  }`}
                  onClick={() => handleUserTypeChange("admin")}
                >
                  <div className="portal-login__user-type-icon">👨‍💼</div>
                  <div className="portal-login__user-type-info">
                    <h3 className="portal-login__user-type-title">관리자</h3>
                    <p className="portal-login__user-type-description">
                      편집 권한이 있는 관리자
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`portal-login__user-type-option ${
                    userType === "guest" ? "active" : ""
                  }`}
                  onClick={() => handleUserTypeChange("guest")}
                >
                  <div className="portal-login__user-type-icon">👁️</div>
                  <div className="portal-login__user-type-info">
                    <h3 className="portal-login__user-type-title">게스트</h3>
                    <p className="portal-login__user-type-description">
                      읽기 전용 접근 권한
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 로그인 폼 */}
            <form onSubmit={handleSubmit} className="portal-login__form">
              <div className="portal-login__form-group">
                <label htmlFor="username" className="portal-login__form-label">
                  사용자명
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={loginForm.username}
                  onChange={handleInputChange}
                  className="portal-login__form-input"
                  placeholder="사용자명을 입력하세요"
                  required
                />
              </div>

              <div className="portal-login__form-group">
                <label htmlFor="password" className="portal-login__form-label">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  className="portal-login__form-input"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>

              {error && (
                <div className="portal-login__error">
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="portal-login__submit-button"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </form>

            <div className="portal-login__footer">
              <p className="portal-login__footer-text">
                계정이 없으신가요? 관리자에게 문의하세요.
              </p>
              <Link href="/" className="portal-login__home-link">
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
