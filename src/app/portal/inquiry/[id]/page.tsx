"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
}

interface InquiryResponse {
  success: boolean;
  data: Inquiry;
  message: string;
}

export default function PortalInquiryDetailPage() {
  const params = useParams();
  // const router = useRouter(); // 사용되지 않음
  const inquiryId = params.id as string;

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadInquiry = async () => {
      try {
        setLoading(true);
        // 관리자는 비밀글도 모두 볼 수 있도록 verified=true 파라미터 추가
        const response = await fetch(
          `/api/inquiries/${inquiryId}?verified=true`
        );
        const data: InquiryResponse = await response.json();

        if (data.success) {
          setInquiry(data.data);
        } else {
          console.error("문의글을 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("서버 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    if (inquiryId) {
      loadInquiry();
    }
  }, [inquiryId]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answer.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/inquiries/${inquiryId}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer: answer.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        alert("답변이 성공적으로 등록되었습니다.");
        // 페이지 새로고침
        window.location.reload();
      } else {
        alert("답변 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("답변 등록 중 오류:", error);
      alert("서버 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="portal-inquiry-detail">
        <div className="portal-inquiry-detail__loading">
          문의글을 불러오는 중...
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="portal-inquiry-detail">
        <div className="portal-inquiry-detail__error">
          문의글을 찾을 수 없습니다.
        </div>
        <Link
          href="/portal/inquiry"
          className="portal-inquiry-detail__back-button"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="portal-inquiry-detail">
      <div className="portal-inquiry-detail__container">
        {/* 페이지 헤더 */}
        <div className="portal-inquiry-detail__header">
          <div className="portal-inquiry-detail__header-content">
            <h1 className="portal-inquiry-detail__title">문의글 상세보기</h1>
            <Link
              href="/portal/inquiry"
              className="portal-inquiry-detail__back-button"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>

        {/* 문의글 내용 */}
        <div className="portal-inquiry-detail__content">
          <div className="portal-inquiry-detail__inquiry">
            <div className="portal-inquiry-detail__inquiry-header">
              <h2 className="portal-inquiry-detail__inquiry-title">
                {inquiry.title}
              </h2>
              <div className="portal-inquiry-detail__meta">
                <div className="portal-inquiry-detail__meta-item">
                  <span className="portal-inquiry-detail__meta-label">
                    작성자:
                  </span>
                  <span className="portal-inquiry-detail__meta-value">
                    {inquiry.author}
                  </span>
                </div>
                <div className="portal-inquiry-detail__meta-item">
                  <span className="portal-inquiry-detail__meta-label">
                    작성일:
                  </span>
                  <span className="portal-inquiry-detail__meta-value">
                    {formatDate(inquiry.createdAt)}
                  </span>
                </div>
                <div className="portal-inquiry-detail__meta-item">
                  <span className="portal-inquiry-detail__meta-label">
                    유형:
                  </span>
                  <span
                    className={`portal-inquiry-detail__type-badge ${
                      inquiry.isSecret ? "secret" : "public"
                    }`}
                  >
                    {inquiry.isSecret ? "비밀글" : "일반글"}
                  </span>
                </div>
                <div className="portal-inquiry-detail__meta-item">
                  <span className="portal-inquiry-detail__meta-label">
                    상태:
                  </span>
                  <span
                    className={`portal-inquiry-detail__status-badge ${
                      inquiry.isAnswered ? "answered" : "pending"
                    }`}
                  >
                    {inquiry.isAnswered ? "답변완료" : "답변대기"}
                  </span>
                </div>
              </div>
            </div>

            <div className="portal-inquiry-detail__inquiry-content">
              <div className="portal-inquiry-detail__content-text">
                {inquiry.content}
              </div>
            </div>
          </div>

          {inquiry.isAnswered && inquiry.answer && (
            <div className="portal-inquiry-detail__answer">
              <div className="portal-inquiry-detail__answer-header">
                <h3 className="portal-inquiry-detail__answer-title">답변</h3>
                <div className="portal-inquiry-detail__answer-meta">
                  <span className="portal-inquiry-detail__answer-date">
                    답변일: {formatDate(inquiry.answeredAt!)}
                  </span>
                </div>
              </div>
              <div className="portal-inquiry-detail__answer-content">
                <div className="portal-inquiry-detail__answer-text">
                  {inquiry.answer}
                </div>
              </div>
            </div>
          )}

          {!inquiry.isAnswered && (
            <div className="portal-inquiry-detail__answer-form">
              <h3 className="portal-inquiry-detail__answer-form-title">
                답변 작성
              </h3>
              <form
                onSubmit={handleSubmitAnswer}
                className="portal-inquiry-detail__form"
              >
                <div className="portal-inquiry-detail__form-group">
                  <label
                    htmlFor="answer"
                    className="portal-inquiry-detail__form-label"
                  >
                    답변 내용
                  </label>
                  <textarea
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="portal-inquiry-detail__form-textarea"
                    rows={8}
                    placeholder="답변 내용을 입력해주세요..."
                    required
                  />
                </div>
                <div className="portal-inquiry-detail__form-actions">
                  <button
                    type="submit"
                    className="portal-inquiry-detail__submit-button"
                    disabled={submitting}
                  >
                    {submitting ? "답변 등록 중..." : "답변 등록"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
