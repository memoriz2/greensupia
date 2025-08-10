"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddAdminPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ 관리자 계정이 성공적으로 생성되었습니다!");
        setTimeout(() => {
          router.push("/portal");
        }, 2000);
      } else {
        setMessage(
          `❌ 오류: ${data.message || "알 수 없는 오류가 발생했습니다."}`
        );
      }
    } catch (error) {
      setMessage("❌ 네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="admin-add-page">
      <div className="admin-add-container">
        <div className="admin-add-header">
          <h1>관리자 계정 추가</h1>
          <p>새로운 관리자 계정을 생성합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-add-form">
          <div className="form-group">
            <label htmlFor="username">사용자명</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="관리자 사용자명을 입력하세요"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="비밀번호를 입력하세요 (최소 6자)"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="비밀번호를 다시 입력하세요"
              className="form-input"
            />
          </div>

          {message && (
            <div
              className={`message ${
                message.includes("✅") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? "생성 중..." : "관리자 계정 생성"}
            </button>

            <Link href="/portal" className="btn btn-secondary">
              대시보드로 돌아가기
            </Link>
          </div>
        </form>

        <div className="admin-add-info">
          <h3>💡 참고사항</h3>
          <ul>
            <li>사용자명은 고유해야 합니다.</li>
            <li>비밀번호는 최소 6자 이상이어야 합니다.</li>
            <li>생성된 계정으로 로그인할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
