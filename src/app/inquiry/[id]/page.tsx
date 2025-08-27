"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Inquiry {
  id: number;
  title: string;
  content: string;
  author: string;
  isSecret: boolean;
  isAnswered: boolean;
  answer?: string;
  answeredAt?: string;
  createdAt: string;
  updatedAt: string;
  requiresPassword?: boolean;
}

export default function InquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.id as string;

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordVerifying, setIsPasswordVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // 문의글 상세 로드
  const loadInquiry = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`);
      if (response.ok) {
        const data = await response.json();
        setInquiry(data.data);

        // 비밀글이고 비밀번호가 필요한 경우 모달 표시
        if (data.data.isSecret && data.data.requiresPassword) {
          setIsPasswordModalOpen(true);
        }
      } else {
        console.error("문의글을 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error("문의글을 불러오는 중 오류가 발생했습니다:", err);
    } finally {
      setIsLoading(false);
    }
  }, [inquiryId]);

  useEffect(() => {
    if (inquiryId) {
      loadInquiry();
    }
  }, [inquiryId, loadInquiry]);

  // 비밀번호 확인
  const handlePasswordVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordVerifying(true);
    setPasswordError(null);

    try {
      const response = await fetch(
        `/api/inquiries/${inquiryId}/verify-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        setIsPasswordModalOpen(false);
        // 비밀번호 확인 후 verified 파라미터와 함께 문의글 로드
        await loadInquiryWithVerification();
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.error || "비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("비밀번호 확인 중 오류:", err);
      setPasswordError("비밀번호 확인 중 오류가 발생했습니다.");
    } finally {
      setIsPasswordVerifying(false);
    }
  };

  // 비밀번호 검증 후 문의글 로드
  const loadInquiryWithVerification = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}?verified=true`);
      if (response.ok) {
        const data = await response.json();
        setInquiry(data.data);
      } else {
        console.error("문의글을 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error("문의글을 불러오는 중 오류가 발생했습니다:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="inquiry-detail">
        <section className="inquiry-detail__loading">
          <h1>문의글 상세</h1>
          <p>문의글을 불러오는 중입니다...</p>
        </section>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="inquiry-detail">
        <section className="inquiry-detail__error">
          <h1>문의글 상세</h1>
          <p>문의글을 찾을 수 없습니다.</p>
          <Link href="/greensupia/inquiry" className="inquiry-detail__button">
            목록으로 돌아가기
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="inquiry-detail">
      <header className="inquiry-detail__header">
        <div className="inquiry-detail__header-content">
          <h1>문의글 상세</h1>
          <div className="inquiry-detail__actions">
            <Link
              href="/greensupia/inquiry"
              className="inquiry-detail__button inquiry-detail__button--secondary"
            >
              목록으로
            </Link>
            {!inquiry.isAnswered && (
              <Link
                href={`/greensupia/inquiry/write/${inquiry.id}`}
                className="inquiry-detail__button inquiry-detail__button--primary"
              >
                수정하기
              </Link>
            )}
          </div>
        </div>
      </header>

      <article className="inquiry-detail__content">
        <header className="inquiry-detail__article-header">
          <h2 className="inquiry-detail__title">
            {inquiry.title}
            {inquiry.isSecret && (
              <span
                className="inquiry-detail__secret-badge"
                aria-label="비밀글"
              >
                🔒
              </span>
            )}
          </h2>

          <div className="inquiry-detail__meta">
            <div className="inquiry-detail__meta-item">
              <span className="inquiry-detail__meta-label">작성자:</span>
              <span className="inquiry-detail__meta-value">
                {inquiry.author}
              </span>
            </div>
            <div className="inquiry-detail__meta-item">
              <span className="inquiry-detail__meta-label">작성일:</span>
              <span className="inquiry-detail__meta-value">
                {formatDate(inquiry.createdAt)}
              </span>
            </div>
            <div className="inquiry-detail__meta-item">
              <span className="inquiry-detail__meta-label">상태:</span>
              <span
                className={`inquiry-detail__status-badge ${
                  inquiry.isAnswered
                    ? "inquiry-detail__status-badge--answered"
                    : "inquiry-detail__status-badge--pending"
                }`}
              >
                {inquiry.isAnswered ? "답변완료" : "답변대기"}
              </span>
            </div>
          </div>
        </header>

        <section className="inquiry-detail__body">
          <div className="inquiry-detail__content-text">
            {inquiry.content.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </section>

        {inquiry.isAnswered && inquiry.answer && (
          <section className="inquiry-detail__answer">
            <h3 className="inquiry-detail__section-title">답변</h3>
            <div className="inquiry-detail__answer-content">
              <div className="inquiry-detail__answer-text">
                {inquiry.answer.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              {inquiry.answeredAt && (
                <div className="inquiry-detail__answer-meta">
                  <span className="inquiry-detail__answer-date">
                    답변일: {formatDate(inquiry.answeredAt)}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}
      </article>

      {/* 비밀번호 입력 모달 */}
      {isPasswordModalOpen && (
        <div className="inquiry-detail__modal-overlay">
          <div className="inquiry-detail__modal">
            <header className="inquiry-detail__modal-header">
              <h2>비밀글 접근</h2>
              <p>
                이 문의글은 비밀글로 설정되어 있습니다. 비밀번호를 입력해주세요.
              </p>
            </header>

            <form
              onSubmit={handlePasswordVerify}
              className="inquiry-detail__modal-form"
            >
              <div className="inquiry-detail__modal-field">
                <label
                  htmlFor="password"
                  className="inquiry-detail__modal-label"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="inquiry-detail__modal-input"
                  placeholder="비밀번호를 입력하세요"
                  autoFocus
                />
                {passwordError && (
                  <p className="inquiry-detail__modal-error">{passwordError}</p>
                )}
              </div>

              <div className="inquiry-detail__modal-actions">
                <button
                  type="button"
                  onClick={() => router.push("/greensupia/inquiry")}
                  className="inquiry-detail__modal-button inquiry-detail__modal-button--secondary"
                  disabled={isPasswordVerifying}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isPasswordVerifying}
                  className="inquiry-detail__modal-button inquiry-detail__modal-button--primary"
                >
                  {isPasswordVerifying ? "확인 중..." : "확인"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
